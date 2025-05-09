import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate, useNavigate } from 'react-router-dom';

function Profile(){
    const userContext = useContext(UserContext);
    const [profile, setProfile] = useState({});
    const navigate = useNavigate();

    useEffect(function(){
        const getProfile = async function(){
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, []);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-4">
                                <h2 className="card-title mb-0">Moj profil</h2>
                            </div>

                            <hr />

                            <p className="fs-5 mb-2">
                                <i className="fas fa-user me-2 text-success"></i>
                                <strong>Uporabniško ime:</strong> {profile.username}
                            </p>

                            <p className="fs-5 mb-2">
                                <i className="fas fa-envelope me-2 text-success"></i>
                                <strong>Email:</strong> {profile.email}
                            </p>
                            <hr />
                            <div className="d-flex gap-3 mt-3">
                                <button className="btn btn-lg btn-block shadow w-50"  style={{backgroundColor: "#b0d16b", color: "#FFFFFF"}}
                                        onClick={() => navigate("/Fridge")}>
                                    Moj hladilnik
                                </button>
                                <button className="btn btn-lg btn-block shadow w-50"  style={{backgroundColor: "#b0d16b", color: "#FFFFFF"}}>
                                    Zgodovina receptov
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;