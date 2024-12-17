import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { ThreatMetrics } from '../../types/security';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

interface ThreatMapProps {
  data: ThreatMetrics['geographic_data'];
}

export const ThreatMap: React.FC<ThreatMapProps> = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count));
  const scale = scaleLinear().domain([0, maxCount]).range([5, 20]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Global Threat Distribution</h3>
      <div className="h-[400px]">
        <ComposableMap
          projectionConfig={{
            scale: 140,
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#E5E7EB"
                  stroke="#D1D5DB"
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: '#D1D5DB' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          {data.map(({ country, count, latitude, longitude }) => (
            <Marker key={country} coordinates={[longitude, latitude]}>
              <circle
                r={scale(count)}
                fill="#EF4444"
                fillOpacity={0.6}
                stroke="#991B1B"
                strokeWidth={1}
              />
            </Marker>
          ))}
        </ComposableMap>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {data.map(({ country, count }) => (
          <div key={country} className="text-sm">
            <span className="font-medium">{country}:</span>{' '}
            <span className="text-red-600">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 