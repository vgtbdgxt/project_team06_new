interface RadarChartProps {
  crowd: number; // 0-1
  noise: number; // 0-1
  aqi: number; // 0-300
  green: number; // 0-1
  traffic: number; // 0-1
  rawAQI: number; // Original AQI value for display
}

export default function RadarChart({ crowd, noise, aqi, green, traffic, rawAQI }: RadarChartProps) {
  const padding = 70; // Increased padding for 5 labels
  const chartSize = 200; // Size of the actual chart area
  const size = chartSize + padding * 2; // Total SVG size
  const center = size / 2;
  const radius = chartSize / 2 - 10; // Chart radius

  // Normalize values to 0-100 for display
  const normalizeCrowd = crowd * 100;
  const normalizeNoise = noise * 100;
  const normalizeAQI = Math.min(100, (aqi / 300) * 100); // AQI normalized to 0-300 -> 0-100
  const normalizeGreen = green * 100;
  const normalizeTraffic = traffic * 100;

  // Convert to radius (0-100 -> 0-radius)
  const r1 = (normalizeCrowd / 100) * radius;
  const r2 = (normalizeNoise / 100) * radius;
  const r3 = (normalizeAQI / 100) * radius;
  const r4 = (normalizeGreen / 100) * radius;
  const r5 = (normalizeTraffic / 100) * radius;

  // Five axes at 0°, 72°, 144°, 216°, 288° (360/5 = 72 degrees apart)
  const angles = [0, (72 * Math.PI) / 180, (144 * Math.PI) / 180, (216 * Math.PI) / 180, (288 * Math.PI) / 180];
  
  // Calculate points for the polygon
  const points = [
    // Crowd Density (top, 0°)
    center + r1 * Math.cos(angles[0] - Math.PI / 2),
    center + r1 * Math.sin(angles[0] - Math.PI / 2),
    // Noise Level (72°)
    center + r2 * Math.cos(angles[1] - Math.PI / 2),
    center + r2 * Math.sin(angles[1] - Math.PI / 2),
    // Air Quality (144°)
    center + r3 * Math.cos(angles[2] - Math.PI / 2),
    center + r3 * Math.sin(angles[2] - Math.PI / 2),
    // Traffic (216°)
    center + r5 * Math.cos(angles[3] - Math.PI / 2),
    center + r5 * Math.sin(angles[3] - Math.PI / 2),
    // Green Space (288°)
    center + r4 * Math.cos(angles[4] - Math.PI / 2),
    center + r4 * Math.sin(angles[4] - Math.PI / 2),
  ];

  const polygonPoints = `${points[0]},${points[1]} ${points[2]},${points[3]} ${points[4]},${points[5]} ${points[6]},${points[7]} ${points[8]},${points[9]}`;

  // Calculate color based on overall burden
  const avgValue = (normalizeCrowd + normalizeNoise + normalizeAQI + normalizeTraffic - normalizeGreen) / 5;
  const getFillColor = () => {
    if (avgValue < 30) return 'rgba(40, 167, 69, 0.3)'; // Green
    if (avgValue < 60) return 'rgba(255, 193, 7, 0.3)'; // Yellow
    return 'rgba(220, 53, 69, 0.3)'; // Red
  };

  const getStrokeColor = () => {
    if (avgValue < 30) return '#28a745'; // Green
    if (avgValue < 60) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  // Axis labels positions - place them outside the chart area
  const labelRadius = radius + 25;
  const labelPositions = [
    { 
      x: center + labelRadius * Math.cos(angles[0] - Math.PI / 2), 
      y: center + labelRadius * Math.sin(angles[0] - Math.PI / 2), 
      label: 'Crowd Density', 
      value: normalizeCrowd, 
      unit: '%', 
      position: 'top', 
      icon: '👥',
      angle: angles[0]
    },
    { 
      x: center + labelRadius * Math.cos(angles[1] - Math.PI / 2), 
      y: center + labelRadius * Math.sin(angles[1] - Math.PI / 2), 
      label: 'Noise Level', 
      value: normalizeNoise, 
      unit: '%', 
      position: 'top-right', 
      icon: '🔊',
      angle: angles[1]
    },
    { 
      x: center + labelRadius * Math.cos(angles[2] - Math.PI / 2), 
      y: center + labelRadius * Math.sin(angles[2] - Math.PI / 2), 
      label: 'Air Quality (AQI)', 
      value: rawAQI, 
      unit: '', 
      position: 'bottom-right', 
      icon: '🌬️',
      angle: angles[2]
    },
    { 
      x: center + labelRadius * Math.cos(angles[3] - Math.PI / 2), 
      y: center + labelRadius * Math.sin(angles[3] - Math.PI / 2), 
      label: 'Traffic', 
      value: normalizeTraffic, 
      unit: '%', 
      position: 'bottom-left', 
      icon: '🚦',
      angle: angles[3]
    },
    { 
      x: center + labelRadius * Math.cos(angles[4] - Math.PI / 2), 
      y: center + labelRadius * Math.sin(angles[4] - Math.PI / 2), 
      label: 'Green Space', 
      value: normalizeGreen, 
      unit: '%', 
      position: 'top-left', 
      icon: '🌳',
      angle: angles[4]
    },
  ];

  return (
    <div className="d-flex justify-content-center" style={{ padding: '15px', overflow: 'visible' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        style={{ maxWidth: '100%', overflow: 'visible' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid circles */}
        {[0.25, 0.5, 0.75, 1.0].map((scale, idx) => (
          <circle
            key={idx}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="1"
            opacity={0.5}
          />
        ))}

        {/* Grid lines (axes) */}
        {angles.map((angle, idx) => {
          const x = center + radius * Math.cos(angle - Math.PI / 2);
          const y = center + radius * Math.sin(angle - Math.PI / 2);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e0e0e0"
              strokeWidth="1"
              opacity={0.5}
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill={getFillColor()}
          stroke={getStrokeColor()}
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Data points */}
        {[
          { r: r1, angle: angles[0] },
          { r: r2, angle: angles[1] },
          { r: r3, angle: angles[2] },
          { r: r5, angle: angles[3] },
          { r: r4, angle: angles[4] },
        ].map((point, idx) => {
          const x = center + point.r * Math.cos(point.angle - Math.PI / 2);
          const y = center + point.r * Math.sin(point.angle - Math.PI / 2);
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="4"
              fill={getStrokeColor()}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {/* Labels */}
        {labelPositions.map((pos, idx) => {
          // Adjust text anchor and position based on label position
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          let xOffset = 0;
          let yOffset = 0;
          
          // Calculate offset based on angle
          const angleDeg = (pos.angle * 180) / Math.PI;
          if (angleDeg < 45 || angleDeg > 315) {
            // Top area
            textAnchor = 'middle';
            yOffset = -12;
          } else if (angleDeg >= 45 && angleDeg < 135) {
            // Right area
            textAnchor = 'start';
            xOffset = 10;
          } else if (angleDeg >= 135 && angleDeg < 225) {
            // Bottom area
            textAnchor = 'middle';
            yOffset = 25;
          } else {
            // Left area
            textAnchor = 'end';
            xOffset = -10;
          }
          
          // Calculate value text position
          let valueYOffset = 0;
          if (angleDeg < 45 || angleDeg > 315) {
            valueYOffset = 16; // Below label for top
          } else if (angleDeg >= 135 && angleDeg < 225) {
            valueYOffset = -18; // Above label for bottom
          } else {
            valueYOffset = 14; // Below label for sides
          }
          
          // Calculate icon position - place icon along the axis line, closer to center
          const iconRadius = radius + 15;
          const iconX = center + iconRadius * Math.cos(pos.angle - Math.PI / 2);
          const iconY = center + iconRadius * Math.sin(pos.angle - Math.PI / 2);
          
          return (
            <g key={idx}>
              {/* Icon */}
              <text
                x={iconX}
                y={iconY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="18"
              >
                {pos.icon}
              </text>
              {/* Label */}
              <text
                x={pos.x + xOffset}
                y={pos.y + yOffset}
                textAnchor={textAnchor}
                dominantBaseline={angleDeg < 45 || angleDeg > 315 ? 'alphabetic' : angleDeg >= 135 && angleDeg < 225 ? 'hanging' : 'middle'}
                fontSize="12"
                fontWeight="600"
                fill="#333"
              >
                {pos.label}
              </text>
              {/* Value */}
              <text
                x={pos.x + xOffset}
                y={pos.y + yOffset + valueYOffset}
                textAnchor={textAnchor}
                dominantBaseline={angleDeg < 45 || angleDeg > 315 ? 'alphabetic' : angleDeg >= 135 && angleDeg < 225 ? 'hanging' : 'middle'}
                fontSize="11"
                fontWeight="500"
                fill="#666"
              >
                {pos.value.toFixed(0)}{pos.unit}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

