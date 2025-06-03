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
    const [profile, setProfile] = useState({});
    const [activeDevices, setActiveDevices] = useState([]);
    const [inactiveDevices, setInactiveDevices] = useState([]);
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
        const fetchDevices = async () => {
            const res = await fetch("http://localhost:3001/api/my-active-inactive-devices", {credentials: "include"});
            const data = await res.json();
            setActiveDevices(data.activeDevices || []);
            setInactiveDevices(data.inactiveDevices || []);
            if ((data.activeDevices || []).length > 0) {
                setSelectedDevice(data.activeDevices[0]);
            } else if ((data.inactiveDevices || []).length > 0) {
                setSelectedDevice(data.inactiveDevices[0]);
            }
        };
        fetchDevices();
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
                                <button className="btn btn-lg btn-block shadow w-50"
                                        style={{backgroundColor: "#b0d16b", color: "#FFFFFF"}}
                                        onClick={() => navigate("/MyFridge")}>
                                    Moj hladilnik
                                </button>
                                <button className="btn btn-lg btn-block shadow w-50"
                                        style={{backgroundColor: "#b0d16b", color: "#FFFFFF"}}
                                        onClick={() => navigate("/RecipeHistory")}>
                                    Zgodovina receptov
                                </button>
                            </div>
                            <hr/>
                            <div className="row mt-4">
                                <div className="col-md-4">
                                    <h5>Active Devices</h5>
                                    <ul className="list-group mb-3">
                                        {activeDevices.length > 0 ? activeDevices.map(device => (
                                            <li
                                                key={device.deviceId}
                                                className={`list-group-item ${selectedDevice && selectedDevice.deviceId === device.deviceId ? 'active' : ''}`}
                                                style={{
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    backgroundColor: selectedDevice && selectedDevice.deviceId === device.deviceId ? '#e6f7e6' : undefined,
                                                    color: '#000000'
                                                }}
                                                onClick={() => handleDeviceClick(device)}
                                            >
                                                {device.deviceId}
                                                <span style={{color: 'green', marginLeft: 8}}>● Connected</span>
                                                <br/>
                                                <small>{new Date(device.timestamp).toLocaleString()}</small>
                                            </li>
                                        )) : <li className="list-group-item">No active devices</li>}
                                    </ul>
                                    <h5>Inactive Devices</h5>
                                    <ul className="list-group">
                                        {inactiveDevices.length > 0 ? inactiveDevices.map(device => (
                                            <li
                                                key={device.deviceId}
                                                className={`list-group-item ${selectedDevice && selectedDevice.deviceId === device.deviceId ? 'active' : ''}`}
                                                style={{
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    backgroundColor: selectedDevice && selectedDevice.deviceId === device.deviceId ? '#e6f7e6' : undefined,
                                                    color: '#000000'
                                                }}
                                                onClick={() => handleDeviceClick(device)}
                                            >
                                                {device.deviceId}
                                                <span style={{color: 'red', marginLeft: 8}}>● Disconnected</span>
                                                <br/>
                                                <small>{new Date(device.timestamp).toLocaleString()}</small>
                                            </li>
                                        )) : <li className="list-group-item">No inactive devices</li>}
                                    </ul>
                                </div>
                                <div className="col-md-8">
                                    <h5>Lokacija naprave</h5>
                                    <div style={{height: "300px", width: "100%"}}>
                                        <MapContainer center={mapCenter} zoom={16}
                                                      style={{height: "100%", width: "100%"}}>
                                            <ChangeMapView center={mapCenter} zoom={16}/>
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution="&copy; OpenStreetMap contributors"
                                            />
                                            {selectedDevice && (
                                                <Marker position={[selectedDevice.latitude, selectedDevice.longitude]}>
                                                    <Popup>
                                                        {selectedDevice.deviceId}<br/>
                                                        {new Date(selectedDevice.timestamp).toLocaleString()}
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
    );
}

export default Profile;