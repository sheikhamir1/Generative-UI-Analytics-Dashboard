import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DynamicChart({ schema }) {
  if (!schema) return null;

  console.log("Received Schema:", schema);

  // 1. Defensive Engineering for Axes
  const firstItem = schema.data?.[0] || {};
  const actualKeys = Object.keys(firstItem);
  const xKey =
    schema.xAxisKey && schema.xAxisKey in firstItem
      ? schema.xAxisKey
      : actualKeys[0];
  const yKeys =
    schema.yAxisKeys && schema.yAxisKeys.every((k) => k in firstItem)
      ? schema.yAxisKeys
      : [actualKeys[1]];

  // 2. The Random Style Selector
  // This picks a number between 0 and 2. It only recalculates when a NEW schema arrives.
  const styleVariant = useMemo(() => Math.floor(Math.random() * 3), [schema]);
  const COLORS = [
    "#1a73e8",
    "#34a853",
    "#fbbc04",
    "#ea4335",
    "#ff6d00",
    "#9c27b0",
  ];

  // ==========================================
  // 1. BAR CHART (3 Variations)
  // ==========================================
  if (schema.componentType === "BarChart") {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{schema.title}</h3>
        <div className="w-full h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            {/* VARIANT 0: Standard Vertical | VARIANT 1: Horizontal | VARIANT 2: Background Bar */}
            <BarChart
              data={schema.data}
              layout={styleVariant === 1 ? "vertical" : "horizontal"}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

              {/* Swap X and Y axes if layout is vertical */}
              <XAxis
                dataKey={styleVariant === 1 ? undefined : xKey}
                type={styleVariant === 1 ? "number" : "category"}
                stroke="#888"
                fontSize={12}
              />
              <YAxis
                dataKey={styleVariant === 1 ? xKey : undefined}
                type={styleVariant === 1 ? "category" : "number"}
                stroke="#888"
                fontSize={12}
                width={80}
              />

              <Tooltip cursor={{ fill: "#f5f5f5" }} />
              <Legend />
              {yKeys.map((key, index) => (
                <Bar
                  key={index}
                  dataKey={key}
                  fill={COLORS[index % COLORS.length]}
                  radius={styleVariant === 1 ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                  background={styleVariant === 2 ? { fill: "#f4f6f8" } : false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. LINE CHART (3 Variations)
  // ==========================================
  if (schema.componentType === "LineChart") {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{schema.title}</h3>
        <div className="w-full h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={schema.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={xKey} stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip />
              <Legend />
              {yKeys.map((key, index) => (
                <Line
                  key={index}
                  // VARIANT 0: Smooth | VARIANT 1: Sharp/Linear | VARIANT 2: Step
                  type={
                    styleVariant === 0
                      ? "monotone"
                      : styleVariant === 1
                        ? "linear"
                        : "step"
                  }
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={styleVariant === 1 ? 2 : 3}
                  // VARIANT 1 gets dashed lines
                  strokeDasharray={styleVariant === 1 ? "5 5" : "0"}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. PIE CHART (3 Variations)
  // ==========================================
  if (schema.componentType === "PieChart") {
    const dataKey = schema.yAxisKeys?.[0] || actualKeys[1];
    const nameKey = schema.xAxisKey || actualKeys[0];

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2 w-full text-left">
          {schema.title}
        </h3>
        <div className="w-full h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={schema.data}
                cx="50%"
                // If it's a half-circle (variant 2), move the center down so it fits better
                cy={styleVariant === 2 ? "70%" : "50%"}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                // VARIANT 0: Standard | VARIANT 1: Donut | VARIANT 2: Donut + Half Circle Gauge
                innerRadius={styleVariant === 0 ? 0 : 70}
                outerRadius={120}
                startAngle={styleVariant === 2 ? 180 : 0}
                endAngle={styleVariant === 2 ? 0 : 360}
                paddingAngle={styleVariant === 1 ? 5 : 0}
                dataKey={dataKey}
                nameKey={nameKey}
              >
                {schema.data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. AREA CHART (NEW - 2 Variations)
  // ==========================================
  if (schema.componentType === "AreaChart") {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{schema.title}</h3>
        <div className="w-full h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={schema.data}>
              <defs>
                {/* VARIANT 0 creates a beautiful fading gradient for the area */}
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={xKey} stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              {yKeys.map((key, index) => (
                <Area
                  key={index}
                  // VARIANT 0: Smooth Gradient | VARIANT 1/2: Solid Step Area
                  type={styleVariant === 0 ? "monotone" : "step"}
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]}
                  fill={
                    styleVariant === 0
                      ? "url(#colorGradient)"
                      : COLORS[index % COLORS.length]
                  }
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // ==========================================
  // 5. RADAR CHART (NEW)
  // ==========================================
  if (schema.componentType === "RadarChart") {
    const dataKey = schema.yAxisKeys?.[0] || actualKeys[1];
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2 w-full text-left">
          {schema.title}
        </h3>
        <div className="w-full h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={schema.data}>
              <PolarGrid />
              <PolarAngleAxis dataKey={xKey} />
              <PolarRadiusAxis />
              <Radar
                name="Total"
                dataKey={dataKey}
                stroke="#1a73e8"
                fill="#1a73e8"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // ==========================================
  // 6. SUMMARY CARDS
  // ==========================================
  if (schema.componentType === "SummaryCards") {
    // ... [Keep your exact SummaryCards code from the previous step here] ...
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{schema.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schema.data.map((item, index) => (
            <div
              key={index}
              className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 flex flex-col justify-center items-center text-center"
            >
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {item[xKey]}
              </p>
              <p className="text-4xl font-black text-blue-600">
                {typeof item[yKeys[0]] === "number"
                  ? item[yKeys[0]].toLocaleString()
                  : item[yKeys[0]]}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <p className="text-red-500">
      Unsupported Component Type: {schema.componentType}
    </p>
  );
}

export default DynamicChart;
