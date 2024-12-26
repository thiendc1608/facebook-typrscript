import { useEffect, useRef } from "react";
import leaflet from "leaflet";
import { useSelector } from "react-redux";
import { postType } from "@/redux/postSlice";

const Map = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const userMarkerRef = useRef<leaflet.Marker | null>(null);
  const mapInstanceRef = useRef<leaflet.Map | null>(null); // Create a new ref to store the map instance
  const { locationTag } = useSelector(
    (state: { post: postType }) => state.post
  );

  useEffect(() => {
    const map = leaflet
      .map(mapRef.current!)
      .setView([locationTag?.latitude || 0, locationTag?.longitude || 0], 8);
    leaflet
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(map);
    mapInstanceRef.current = map;
    return () => {
      // Clean up after the effect here
      map.remove();
    };
  }, [locationTag?.latitude, locationTag?.longitude]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      userMarkerRef.current = leaflet
        .marker([locationTag?.latitude || 0, locationTag?.longitude || 0])
        .addTo(mapInstanceRef.current);
    }
  }, []);

  return (
    <div id="map" ref={mapRef}>
      Map
    </div>
  );
};

export default Map;
