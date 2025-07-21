import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const FloatingParticles = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <Particles
        id="tsparticles-bg"
        init={particlesInit}
        options={{
          fullScreen: false,
          background: { color: 'transparent' },
          fpsLimit: 60,
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: ['#fff', '#a5b4fc', '#fbcfe8', '#f472b6'] },
            shape: { type: 'circle' },
            opacity: { value: 0.7, random: true },
            size: { value: 2.5, random: { enable: true, minimumValue: 1 } },
            move: {
              enable: true,
              speed: 0.3,
              direction: 'none',
              random: true,
              straight: false,
              outModes: { default: 'out' },
            },
            twinkle: {
              particles: {
                enable: true,
                frequency: 0.15,
                color: '#fff',
              },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default FloatingParticles;
