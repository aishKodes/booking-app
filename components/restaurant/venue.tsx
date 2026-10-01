"use client";
import { useDemo } from "@/lib/store";
import { restaurant } from "@/lib/demo-data";
import { directionsUrl, niceTime } from "@/lib/utils";
import { ArrowUpRight, MapPin, Clock3, Phone, Car, TrainFront } from "lucide-react";
export function VenueDetails() {
  const { data } = useDemo();
  const r = data?.settings || restaurant;
  return (
    <div className="venue-grid">
      <div className="venue-info">
        <span className="eyebrow">RIGHT HERE, IN THE HEART OF IT.</span>
        <h2>
          Meet us on
          <br />
          <em>Park Street.</em>
        </h2>
        <div className="venue-detail">
          <MapPin size={19} />
          <div>
            <strong>{r.name}, Kolkata</strong>
            <p>{r.address}</p>
          </div>
        </div>
        <div className="venue-detail">
          <Clock3 size={19} />
          <div>
            <strong>Every day</strong>
            <p>
              Lunch · {niceTime(r.lunchOpen)} – {niceTime(r.lunchClose)}
              <br />
              Dinner · {niceTime(r.dinnerOpen)} – {niceTime(r.dinnerClose)}
            </p>
          </div>
        </div>
        <div className="venue-detail">
          <Phone size={19} />
          <div>
            <strong>{r.phone}</strong>
            <p>{r.email}</p>
          </div>
        </div>
        <a href={directionsUrl} target="_blank" rel="noreferrer" className="button button-primary">
          Explore the neighbourhood <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="location-panel">
        <div className="map-street street-one" />
        <div className="map-street street-two" />
        <div className="map-street street-three" />
        <span className="map-label map-label-one">PARK STREET</span>
        <span className="map-label map-label-two">CAMAC STREET</span>
        <span className="map-park">ALLEN PARK</span>
        <div className="map-marker">
          <MapPin size={22} fill="currentColor" />
          <span>ARDO</span>
        </div>
        <div className="map-info">
          <span>
            <Car size={16} /> Valet parking at the entrance
          </span>
          <span>
            <TrainFront size={16} /> 5 min from Park Street Metro
          </span>
          <small>Illustrative map · Fictional restaurant location</small>
        </div>
      </div>
    </div>
  );
}
