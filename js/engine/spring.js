/**
 * Damped Harmonic Spring Physics Solver
 * Eliminates cheap CSS linear transitions.
 * Provides organic, mechanical, tactile responsiveness.
 */

export class Spring {
  constructor({ stiffness = 180, damping = 16, mass = 1.0, precision = 0.001 } = {}) {
    this.stiffness = stiffness; // Spring constant (k)
    this.damping = damping;     // Damping coefficient (c)
    this.mass = mass;           // Object mass (m)
    this.precision = precision; // Rest threshold
    
    this.current = 0;
    this.target = 0;
    this.velocity = 0;
    this.isSettled = true;
  }

  setTarget(targetVal) {
    this.target = targetVal;
    this.isSettled = false;
  }

  setCurrent(currentVal) {
    this.current = currentVal;
    this.velocity = 0;
    this.isSettled = false;
  }

  snapTo(val) {
    this.current = val;
    this.target = val;
    this.velocity = 0;
    this.isSettled = true;
  }

  update(dtSeconds) {
    if (this.isSettled) return this.current;

    // Clamp dt to prevent explosion on background tab throttling
    const dt = Math.min(dtSeconds, 0.064);

    const displacement = this.current - this.target;
    const springForce = -this.stiffness * displacement;
    const dampingForce = -this.damping * this.velocity;
    const acceleration = (springForce + dampingForce) / this.mass;

    this.velocity += acceleration * dt;
    this.current += this.velocity * dt;

    if (Math.abs(this.velocity) < this.precision && Math.abs(displacement) < this.precision) {
      this.current = this.target;
      this.velocity = 0;
      this.isSettled = true;
    }

    return this.current;
  }
}

export class Spring2D {
  constructor(options = {}) {
    this.x = new Spring(options);
    this.y = new Spring(options);
  }

  setTarget(x, y) {
    this.x.setTarget(x);
    this.y.setTarget(y);
  }

  snapTo(x, y) {
    this.x.snapTo(x);
    this.y.snapTo(y);
  }

  update(dt) {
    return {
      x: this.x.update(dt),
      y: this.y.update(dt),
      isSettled: this.x.isSettled && this.y.isSettled
    };
  }
}
