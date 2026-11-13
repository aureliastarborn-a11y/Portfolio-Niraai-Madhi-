import React from 'react';
import './HamsterWheel.css';

export default function HamsterWheel({ className = '', size = '8px', style = {} }) {
  return (
    <div
      aria-label="Hamster running in a wheel"
      role="img"
      className={`wheel-and-hamster select-none pointer-events-none ${className}`}
      style={{ '--hamster-size': size, ...style }}
    >
      <div className="wheel" />
      <div className="hamster">
        <div className="hamster__body">
          <div className="hamster__head">
            <div className="hamster__ear" />
            <div className="hamster__eye" />
            <div className="hamster__nose" />
          </div>
          <div className="hamster__limb hamster__limb--fr" />
          <div className="hamster__limb hamster__limb--fl" />
          <div className="hamster__limb hamster__limb--br" />
          <div className="hamster__limb hamster__limb--bl" />
          <div className="hamster__tail" />
        </div>
      </div>
      <div className="spoke" />
    </div>
  );
}
