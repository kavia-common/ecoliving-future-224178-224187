import React from 'react';

/**
 * Calculation constants (exported for testability)
 */
export const COMMUTE_EMISSIONS = {
  car: 0.251, // kg CO2 per km
  bus: 0.105,
  train: 0.041,
  bike: 0,
  walk: 0
};
export const ENERGY_EMISSIONS = {
  coal: 0.82,     // kg CO2 per kWh
  gas: 0.49,
  solar: 0.05,
  wind: 0.012,
  hydro: 0.024,
  grid: 0.4
};
export const DIET_EMISSIONS = {
  low: 3.0,     // kg CO2 per day
  medium: 5.0,
  high: 7.0
};

/**
 * PUBLIC_INTERFACE
 * computeImpact: Pure function to compute weekly emissions
 */
export function computeImpact({ mode, distanceKm, daysPerWeek, kwhPerWeek, energySource, dietLevel }) {
  const commute = (COMMUTE_EMISSIONS[mode] ?? 0) * Math.max(0, distanceKm) * Math.max(0, daysPerWeek);
  const energy = (ENERGY_EMISSIONS[energySource] ?? ENERGY_EMISSIONS.grid) * Math.max(0, kwhPerWeek);
  const diet = (DIET_EMISSIONS[dietLevel] ?? DIET_EMISSIONS.medium) * 7; // weekly
  const total = commute + energy + diet;
  return { commute, energy, diet, total };
}

/**
 * PUBLIC_INTERFACE
 * ImpactCalculator component
 */
export default function ImpactCalculator() {
  const [form, setForm] = React.useState({
    mode: 'train',
    distanceKm: 10,
    daysPerWeek: 5,
    kwhPerWeek: 50,
    energySource: 'grid',
    dietLevel: 'medium'
  });
  const [errors, setErrors] = React.useState({});
  const [results, setResults] = React.useState(() => computeImpact(form));

  const validate = (next) => {
    const e = {};
    if (isNaN(next.distanceKm) || next.distanceKm < 0) e.distanceKm = 'Distance must be a non-negative number.';
    if (isNaN(next.daysPerWeek) || next.daysPerWeek < 0 || next.daysPerWeek > 7) e.daysPerWeek = 'Days per week must be 0-7.';
    if (isNaN(next.kwhPerWeek) || next.kwhPerWeek < 0) e.kwhPerWeek = 'kWh must be a non-negative number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  React.useEffect(() => {
    setResults(computeImpact(form));
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    const parsed = ['distanceKm', 'daysPerWeek', 'kwhPerWeek'].includes(name) ? Number(value) : value;
    const next = { ...form, [name]: parsed };
    if (validate(next)) {
      setForm(next);
    } else {
      setForm(next);
    }
  };

  const total = results.total || 0;
  const commutePct = total ? Math.min(100, (results.commute / total) * 100) : 0;
  const energyPct = total ? Math.min(100, (results.energy / total) * 100) : 0;
  const dietPct = total ? Math.min(100, (results.diet / total) * 100) : 0;

  return (
    <div className="calc-form card reveal fade-up" role="form" aria-labelledby="calc-title">
      <h3 id="calc-title">Impact Calculator</h3>
      <p className="small muted">Adjust your lifestyle inputs to see estimated weekly CO2 emissions.</p>

      <div className="calc-grid" aria-describedby="calc-help">
        <div className="input">
          <label htmlFor="mode">Commute mode</label>
          <select id="mode" name="mode" value={form.mode} onChange={onChange} aria-describedby="mode-help">
            {Object.keys(COMMUTE_EMISSIONS).map(k => (
              <option key={k} value={k}>{k[0].toUpperCase() + k.slice(1)}</option>
            ))}
          </select>
          <span id="mode-help" className="small muted">Emissions factor applied per km.</span>
        </div>

        <div className="input">
          <label htmlFor="distanceKm">One-way distance (km)</label>
          <input id="distanceKm" name="distanceKm" type="number" inputMode="decimal" value={form.distanceKm} onChange={onChange} min="0" step="0.1" aria-invalid={!!errors.distanceKm} aria-describedby="distance-err" />
          {errors.distanceKm && <span id="distance-err" className="error" role="alert">{errors.distanceKm}</span>}
        </div>

        <div className="input">
          <label htmlFor="daysPerWeek">Commute days per week</label>
          <input id="daysPerWeek" name="daysPerWeek" type="number" inputMode="numeric" value={form.daysPerWeek} onChange={onChange} min="0" max="7" aria-invalid={!!errors.daysPerWeek} aria-describedby="days-err" />
          {errors.daysPerWeek && <span id="days-err" className="error" role="alert">{errors.daysPerWeek}</span>}
        </div>

        <div className="input">
          <label htmlFor="kwhPerWeek">Home energy use (kWh/week)</label>
          <input id="kwhPerWeek" name="kwhPerWeek" type="number" inputMode="decimal" value={form.kwhPerWeek} onChange={onChange} min="0" aria-invalid={!!errors.kwhPerWeek} aria-describedby="kwh-err" />
          {errors.kwhPerWeek && <span id="kwh-err" className="error" role="alert">{errors.kwhPerWeek}</span>}
        </div>

        <div className="input">
          <label htmlFor="energySource">Energy source</label>
          <select id="energySource" name="energySource" value={form.energySource} onChange={onChange}>
            {Object.keys(ENERGY_EMISSIONS).map(k => (
              <option key={k} value={k}>{k[0].toUpperCase() + k.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="input">
          <label htmlFor="dietLevel">Diet</label>
          <select id="dietLevel" name="dietLevel" value={form.dietLevel} onChange={onChange}>
            <option value="low">Plant-forward</option>
            <option value="medium">Balanced</option>
            <option value="high">Meat-heavy</option>
          </select>
        </div>
      </div>

      <div className="results" aria-live="polite" aria-atomic="true">
        <div className="number"><strong>Total:</strong> {total.toFixed(2)} kg CO₂e / week</div>
        <div>
          <div className="small muted">Commute: {results.commute.toFixed(1)} kg</div>
          <div className="bar" aria-hidden="true"><span style={{ width: `${commutePct}%` }} /></div>
        </div>
        <div>
          <div className="small muted">Home energy: {results.energy.toFixed(1)} kg</div>
          <div className="bar" aria-hidden="true"><span style={{ width: `${energyPct}%` }} /></div>
        </div>
        <div>
          <div className="small muted">Diet: {results.diet.toFixed(1)} kg</div>
          <div className="bar" aria-hidden="true"><span style={{ width: `${dietPct}%` }} /></div>
        </div>
        <div className="small muted" id="calc-help">These are approximate factors for educational purposes.</div>
      </div>
    </div>
  );
}
