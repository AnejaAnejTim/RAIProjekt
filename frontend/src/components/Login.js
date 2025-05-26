import {useContext, useEffect, useState} from 'react';
import {UserContext} from '../userContext';
import {Navigate} from 'react-router-dom';
import {Smartphone, Clock, Shield, AlertCircle, CheckCircle, XCircle} from 'lucide-react';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext);
    const [step, setStep] = useState('login')
    const [confirmationToken, setConfirmationToken] = useState('');
    const [timeLeft, setTimeLeft] = useState(300);
    const [loading, setLoading] = useState(false);

    const getDeviceInfo = () => {
        const userAgent = navigator.userAgent;
        const browser = getBrowserName(userAgent);
        const os = getOperatingSystem(userAgent);

        return {
            browser,
            os,
            device: 'Desktop',
            userAgent
        };
    };
    const getBrowserName = (userAgent) => {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Unknown';
    };

    const getOperatingSystem = (userAgent) => {
        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac')) return 'macOS';
        if (userAgent.includes('Linux')) return 'Linux';
        return 'Unknown';
    };

    async function Login(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const loginRes = await fetch("http://localhost:3001/users/login", {
                method: "POST",
                credentials: "include",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const loginData = await loginRes.json();

            if (loginData._id !== undefined) {
                const confirmRes = await fetch('http://localhost:3001/users/login-confirmation/initiate', {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: loginData._id,
                        username: username,
                        password: password,
                        email: loginData.email,
                        deviceInfo: getDeviceInfo()
                    }),
                });

                const confirmData = await confirmRes.json();

                if (confirmData.success) {
                    setConfirmationToken(confirmData.confirmationToken);
                    setTimeLeft(confirmData.expiresIn || 300);
                    setStep('waiting');
                    startStatusPolling(confirmData.confirmationToken);
                } else {
                    setError(confirmData.message || 'Failed to initiate mobile confirmation');
                }
            } else {
                setError("Invalid username or password");
                setUsername("");
                setPassword("");
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    }

    const startStatusPolling = (token) => {
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`http://localhost:3001/login-confirmation/status/${token}`, {
                    credentials: "include"
                });
                const data = await response.json();

                if (data.success) {
                    if (data.status === 'approved') {
                        clearInterval(pollInterval);
                        await completeSecureLogin(token);
                    } else if (data.status === 'denied') {
                        clearInterval(pollInterval);
                        setStep('error');
                        setError('Login denied from mobile device');
                    }
                }
            } catch (err) {
                console.error('Status polling error:', err);
            }
        }, 2000);

        setTimeout(() => {
            clearInterval(pollInterval);
            if (step === 'waiting') {
                setStep('error');
                setError('Login request expired');
            }
        }, timeLeft * 1000);
    };

    const completeSecureLogin = async (token) => {
        try {
            const response = await fetch('http://localhost:3001/users/login-confirmation/complete', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({confirmationToken: token}),
            });

            const data = await response.json();

            if (data.success && data.user) {
                userContext.setUserContext(data.user);
                setStep('success');
            } else {
                setStep('error');
                setError(data.message || 'Failed to complete login');
            }
        } catch (err) {
            setStep('error');
            setError('Failed to complete secure login');
            console.error('Complete login error:', err);
        }
    };

    useEffect(() => {
        if (step === 'waiting' && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [step, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const resetLogin = () => {
        setStep('login');
        setError('');
        setConfirmationToken('');
        setTimeLeft(300);
        setUsername('');
        setPassword('');
    };

    return (
        <div className="row d-flex justify-content-center align-items-center h-100">
            {userContext.user && <Navigate replace to="/"/>}
            <div className="col col-xl-10">
                <div className="card shadow" style={{borderRadius: "1rem"}}>
                    <div className="row g-0">
                        <div className="col-md-6 col-lg-5 d-none d-md-block">
                            <img
                                src="https://img.freepik.com/premium-photo/background-food-fruits-vegetables-collection-fruit-vegetable-portrait-format-healthy-eating-diet-apples-oranges-tomatoes_770123-2035.jpg"
                                alt="login form"
                                className="img-fluid"
                                style={{borderRadius: "1rem 0 0 1rem"}}
                            />
                        </div>
                        <div className="col-md-6 col-lg-7 d-flex align-items-center">
                            <div className="card-body p-4 p-lg-5 text-black">
                                <div className="d-flex align-items-center mb-3 pb-1">
                                    <img
                                        src="/logo.png"
                                        alt="logo"
                                        style={{width: "70px", height: "70px", objectFit: "contain"}}
                                        className="me"
                                    />
                                    <span className="h1 fw- mb-0">YummyAi</span>
                                </div>

                                {/* Login Form */}
                                {step === 'login' && (
                                    <>
                                        <div className="d-flex align-items-center mb-3">
                                            <Shield className="me-2 text-primary" size={24}/>
                                            <h5 className="fw-normal mb-0">Secure Login - Prijavi se v svoj profil</h5>
                                        </div>
                                        <p className="text-muted small mb-4">Mobile confirmation required for enhanced
                                            security</p>

                                        <form onSubmit={Login}>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="text"
                                                    id="username"
                                                    className="form-control form-control-lg"
                                                    placeholder="Uporabniško ime"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="password"
                                                    className="form-control form-control-lg"
                                                    placeholder="Geslo"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            {error && (
                                                <div className="d-flex align-items-center text-danger mb-3">
                                                    <AlertCircle size={16} className="me-2"/>
                                                    <span>{error}</span>
                                                </div>
                                            )}

                                            <div className="pt-1 mb-4">
                                                <button
                                                    type="submit"
                                                    className="btn btn-lg btn-block shadow w-100"
                                                    disabled={!username || !password || loading}
                                                    style={{backgroundColor: "#b0d16b", color: "#FFFFFF"}}
                                                >
                                                    {loading ? 'Sending...' : 'Secure Login'}
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}

                                {/* Waiting for Mobile Confirmation */}
                                {step === 'waiting' && (
                                    <div className="text-center">
                                        <Smartphone className="mb-3 text-primary" size={48}
                                                    style={{animation: 'pulse 2s infinite'}}/>
                                        <h5 className="fw-bold mb-3">Confirm on Mobile Device</h5>
                                        <p className="text-muted mb-4">
                                            A login confirmation has been sent to your mobile device. Please approve or
                                            deny the login request.
                                        </p>

                                        <div className="bg-light rounded p-3 mb-4">
                                            <div className="d-flex align-items-center justify-content-center mb-2">
                                                <Clock className="me-2 text-primary" size={20}/>
                                                <span className="h5 mb-0 font-monospace">{formatTime(timeLeft)}</span>
                                            </div>
                                            <small className="text-muted">Time remaining</small>
                                        </div>

                                        <div className="small text-muted">
                                            <p>Device: {getDeviceInfo().browser} on {getDeviceInfo().os}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Success */}
                                {step === 'success' && (
                                    <div className="text-center">
                                        <CheckCircle className="mb-3 text-success" size={48}/>
                                        <h5 className="fw-bold mb-3 text-success">Login Successful!</h5>
                                        <p className="text-muted mb-4">
                                            Your login has been approved. Redirecting to dashboard...
                                        </p>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Error */}
                                {step === 'error' && (
                                    <div className="text-center">
                                        <XCircle className="mb-3 text-danger" size={48}/>
                                        <h5 className="fw-bold mb-3 text-danger">Login Failed</h5>
                                        <p className="text-muted mb-4">{error}</p>
                                        <button
                                            onClick={resetLogin}
                                            className="btn btn-lg shadow"
                                            style={{backgroundColor: "#b0d16b", color: "#FFFFFF"}}
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}

                                {step === 'login' && (
                                    <p className="mb-5 pb-lg-2" style={{color: "#393f81"}}>
                                        Še nimate računa? <a href="/register" style={{color: "#393f81"}}>Registrirajte se
                                        tukaj</a>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;