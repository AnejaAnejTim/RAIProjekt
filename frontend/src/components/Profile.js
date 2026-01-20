import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function Profile() {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    const [profile, setProfile] = useState({});
    const [activeDeviceIds, setActiveDeviceIds] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [mapCenter, setMapCenter] = useState([46.056946, 14.505751]);


    const [wifiSsid, setWifiSsid] = useState("");
    const [wifiPass, setWifiPass] = useState("");
    const [wifiStatus, setWifiStatus] = useState(null);
    const [wifiLoading, setWifiLoading] = useState(false);



    useEffect(() => {
        const getProfile = async () => {
            const res = await fetch("/users/profile", { credentials: "include" });
            const data = await res.json();
            setProfile(data);
        };
        getProfile();
    }, []);


    useEffect(() => {
        const fetchActiveDevices = async () => {
            try {
                const res = await fetch("/api/active-devices", { credentials: "include" });
                const data = await res.json();
                setActiveDeviceIds(data.devices || []);
            } catch (err) {
                console.error("Napaka pri pridobivanju aktivnih naprav:", err);
            }
        };

        fetchActiveDevices();
        const intervalId = setInterval(fetchActiveDevices, 5000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const getDevices = async () => {
            try {
                const res = await fetch("/api/my-latest-locations", { credentials: "include" });
                const data = await res.json();

                setDevices(prev => {
                    const map = new Map(data.map(d => [d.deviceId, d]));
                    const ordered = prev.map(d => map.get(d.deviceId)).filter(Boolean);
                    const added = data.filter(d => !prev.some(p => p.deviceId === d.deviceId));
                    return [...ordered, ...added];
                });

                setSelectedDevice(prev => {
                    const found = data.find(d => d.deviceId === prev?.deviceId);
                    return found || data[0] || null;
                });
            } catch (err) {
                console.error("Napaka pri osveževanju naprav:", err);
            }
        };

        getDevices();
        const intervalId = setInterval(getDevices, 5000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (selectedDevice) {
            setMapCenter([selectedDevice.latitude, selectedDevice.longitude]);
        }
    }, [selectedDevice]);

    function ChangeMapView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
    }


    const submitWifi = async (e) => {
        e.preventDefault();
        setWifiStatus(null);
        setWifiLoading(true);

        try {
            const qs = new URLSearchParams({
                ssid: wifiSsid,
                pass: wifiPass
            });

            await fetch(`http://172.20.10.3/wifi?${qs.toString()}`, {
                method: "GET",
                mode: "no-cors"
            });

            setWifiStatus({
                type: "success",
                msg: "Wi-Fi nastavitve so bile poslane. Naprava se lahko ponovno poveže."
            });

            setWifiPass("");
        } catch (err) {
            console.error(err);
            setWifiStatus({
                type: "danger",
                msg: "Napaka pri pošiljanju nastavitev. Preverite povezavo z napravo."
            });
        } finally {
            setWifiLoading(false);
        }
    };


    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-body">

                            <h2 className="mb-4">Moj profil</h2>

                            <p className="fs-5">
                                <strong>Uporabniško ime:</strong> {profile.username}
                            </p>
                            <p className="fs-5">
                                <strong>Email:</strong> {profile.email}
                            </p>

                            <hr />

                            <div className="d-flex gap-3 mb-4">
                                <button
                                    className="btn btn-lg w-50"
                                    style={{ backgroundColor: "#b0d16b", color: "#fff" }}
                                    onClick={() => navigate("/MyFridge")}
                                >
                                    Moj hladilnik
                                </button>
                                <button
                                    className="btn btn-lg w-50"
                                    style={{ backgroundColor: "#b0d16b", color: "#fff" }}
                                    onClick={() => navigate("/RecipeHistory")}
                                >
                                    Zgodovina receptov
                                </button>
                            </div>

                            <hr />

        

                            <h5 className="text-center mb-3">Temperatura hladilnika</h5>

                            <div className="card shadow border-0 mx-auto mb-4" style={{ maxWidth: 400 }}>
                                <div className="card-body text-center">

                                    {!profile.fridgeTemp && (
                                        <div className="text-muted">Pridobivam temperaturo…</div>
                                    )}

                                    {profile.fridgeTemp?.ok === false && (
                                        <div className="text-danger">
                                            {profile.fridgeTemp.error}
                                        </div>
                                    )}

                                    {profile.fridgeTemp?.ok === true && (
                                        <>
                                            <div className="d-flex justify-content-center gap-2">
                                                <span style={{ fontSize: "3rem", fontWeight: 700 }}>
                                                    {profile.fridgeTemp.temp}
                                                </span>
                                                <span style={{ fontSize: "1.5rem" }}>°C</span>
                                            </div>
                                            <div className="text-muted mt-2">
                                                Naprava: <strong>172.20.10.3</strong>
                                            </div>
                                            <div className="text-muted">
                                                {new Date(profile.fridgeTemp.timestamp).toLocaleString()}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

              

                            <h5 className="text-center mb-3">Nastavitve Wi-Fi (ESP)</h5>

                            <div className="card shadow border-0 mx-auto" style={{ maxWidth: 500 }}>
                                <div className="card-body">

                                    {wifiStatus && (
                                        <div className={`alert alert-${wifiStatus.type}`}>
                                            {wifiStatus.msg}
                                        </div>
                                    )}

                                    <form onSubmit={submitWifi}>
                                        <div className="mb-3">
                                            <label className="form-label">SSID</label>
                                            <input
                                                className="form-control"
                                                value={wifiSsid}
                                                onChange={e => setWifiSsid(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Geslo</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={wifiPass}
                                                onChange={e => setWifiPass(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button
                                            className="btn btn-success"
                                            type="submit"
                                            disabled={wifiLoading}
                                        >
                                            {wifiLoading ? "Pošiljam…" : "Shrani Wi-Fi"}
                                        </button>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
