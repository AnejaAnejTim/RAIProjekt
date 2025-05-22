import { useState } from 'react';

function Register() {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [email, setEmail] = useState([]);
    const [error, setError] = useState([]);

    async function Register(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/users", {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            username: username,
            password: password
        })
    });

    const data = await res.json();

    if (res.status === 201 && data._id !== undefined) {
        window.location.href = "/login";
    } else {
        setPassword("");
        if (res.status === 301) {
            setError("Uporabnik s takšnim uporabniškim imenom ali emailom že obstaja.");
        } else {
            setError("Registracija neuspešna.");
        }
    }
}


    return (
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col col-xl-10">
          <div className="card shadow" style={{ borderRadius: "1rem" }}>
            <div className="row g-0">
              <div className="col-md-6 col-lg-5 d-none d-md-block">
                <img
                  src="https://img.freepik.com/premium-photo/background-food-fruits-vegetables-collection-fruit-vegetable-portrait-format-healthy-eating-diet-apples-oranges-tomatoes_770123-2035.jpg"
                  alt="register form"
                  className="img-fluid"
                  style={{ borderRadius: "1rem 0 0 1rem", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="col-md-6 col-lg-7 d-flex align-items-center">
                <div className="card-body p-4 p-lg-5 text-black">
                  <div className="d-flex align-items-center mb-3 pb-1">
                    <img
                      src="/logo.png"
                      alt="logo"
                      style={{ width: "70px", height: "70px", objectFit: "contain" }}
                      className="me-2"
                    />
                     <span className="h1 fw- mb-0">YummyAi</span>
                  </div>

                  <h5 className="fw-normal mb-3 pb-3">
                    Registracija
                  </h5>

                  <form onSubmit={Register}>
                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="email"
                        className="form-control form-control-lg"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

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

                    {error && <div className="text-danger mb-3">{error}</div>}

                    <div className="pt-1 mb-4">
                      <button
                        type="submit"
                        className="btn btn-lg btn-block shadow"
                        style={{ backgroundColor: "#b0d16b", color: "#FFFFFF" }}
                        disabled={!email || !username || !password}
                      >
                        Registracija
                      </button>
                    </div>

                    <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                      Že imate račun? <a href="/login" style={{ color: "#393f81" }}>Prijavite se tukaj</a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Register;