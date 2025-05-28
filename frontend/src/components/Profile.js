import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from '../userContext';
import {useNavigate} from 'react-router-dom';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
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
    const [activeDeviceIds, setActiveDeviceIds] = useState([]);
    const [profile, setProfile] = useState({});
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [mapCenter, setMapCenter] = useState([46.056946, 14.505751]);
    const navigate = useNavigate();

    useEffect(() => {
        const getProfile = async () => {
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
        };
        getProfile();
    }, []);

    useEffect(() => {
        const fetchActiveDevices = async () => {
            const res = await fetch("http://localhost:3001/api/active-devices", {credentials: "include"});
            const data = await res.json();
            setActiveDeviceIds(Array.isArray(data) ? data.map(d => d.deviceId) : Object.keys(data));
        };
        fetchActiveDevices();
    }, []);

    useEffect(() => {
        const getDevices = async () => {
            const res = await fetch("http://localhost:3001/api/my-latest-locations", {credentials: "include"});
            const data = await res.json();
            setDevices(data);
            if (data.length > 0) {
                setSelectedDevice(data[0]);
                setMapCenter([data[0].latitude, data[0].longitude]);
            }
        };
        getDevices();
    }, []);

    function ChangeMapView({center, zoom}) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
    }

    const handleDeviceClick = (device) => {
        setSelectedDevice(device);
        setMapCenter([device.latitude, device.longitude]);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-4">
                                <h2 className="card-title mb-0">Moj profil</h2>
                            </div>
                            <hr/>
                            <p className="fs-5 mb-2">
                                <i className="fas fa-user me-2 text-success"></i>
                                <strong>Uporabniško ime:</strong> {profile.username}
                            </p>
                            <p className="fs-5 mb-2">
                                <i className="fas fa-envelope me-2 text-success"></i>
                                <strong>Email:</strong> {profile.email}
                            </p>
                            <hr/>
                            <div className="d-flex gap-3 mt-3">
                                <button
                                    className="btn btn-lg btn-block shadow w-50"
                                    style={{backgroundColor: "#b0d16b", color: "#FFFFFF"}}
                                    onClick={() => navigate("/MyFridge")}
                                >
                                    Moj hladilnik
                                </button>
                                <button
                                    className="btn btn-lg btn-block shadow w-50"
                                    style={{backgroundColor: "#b0d16b", color: "#FFFFFF"}}
                                    onClick={() => navigate("/RecipeHistory")}
                                >
                                    Zgodovina receptov
                                </button>
                            </div>
                            <hr/>
                            <div className="row mt-4">
                                <div className="col-md-4">
                                    <h5>Moje naprave</h5>
                                    <ul className="list-group">
                                        {devices.map(device => {
                                            const isActive = activeDeviceIds.includes(device.deviceId);
                                            const isSelected = selectedDevice && selectedDevice.deviceId === device.deviceId;

                                            return (
                                                <li
                                                    key={device.deviceId}
                                                    className="list-group-item"
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontWeight: isActive ? 'bold' : 'normal',
                                                        backgroundColor: isSelected ? '#e4f4c2' : 'white',
                                                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                                        transition: 'all 0.2s ease-in-out',
                                                        boxShadow: isSelected ? '0 0 10px rgba(176, 209, 107, 0.6)' : 'none',
                                                        border: isSelected ? '1px solid #b0d16b' : '1px solid #dee2e6',
                                                    }}
                                                    onClick={() => handleDeviceClick(device)}
                                                >
                                                    {device.deviceId}
                                                    {isActive && (
                                                        <span style={{color: '#b0d16b', marginLeft: 8}}>Connected</span>
                                                    )}
                                                    <br/>
                                                    <small>{new Date(device.timestamp).toLocaleString()}</small>
                                                </li>
                                            );
                                        })}
                                        {devices.length === 0 && <li className="list-group-item">Ni naprav</li>}
                                    </ul>
                                </div>
                                <div className="col-md-8">
                                    <h5>Lokacija naprave</h5>
                                    <div className="card shadow border-0"
                                         style={{borderRadius: '1rem', overflow: 'hidden'}}>
                                        <div style={{height: "300px", width: "100%"}}>
                                            <MapContainer center={mapCenter} zoom={16}
                                                          style={{height: "100%", width: "100%"}}>
                                                <ChangeMapView center={mapCenter} zoom={16}/>
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution="&copy; OpenStreetMap contributors"
                                                />
                                                {selectedDevice && (
                                                    <Marker
                                                        position={[selectedDevice.latitude, selectedDevice.longitude]}
                                                        icon={L.icon({
                                                            iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
                                                            iconSize: [32, 32],
                                                            iconAnchor: [16, 32],
                                                            popupAnchor: [0, -32],
                                                        })}
                                                    >
                                                        <Popup>
                                                            <strong>ID:</strong> {selectedDevice.deviceId}<br/>
                                                            <strong>Čas:</strong> {new Date(selectedDevice.timestamp).toLocaleString()}
                                                        </Popup>
                                                    </Marker>
                                                )}
                                            </MapContainer>
                                        </div>
                                    </div>
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
