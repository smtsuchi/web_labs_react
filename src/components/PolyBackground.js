import React, { useEffect } from 'react';
import { ReactComponent as PolyMountains }  from './icons/background.svg';


export default function PolyBackground() {
    const TimelineMax = window.TimelineMax;
    const CSSPlugin = window.CSSPlugin;
    const Elastic = window.Elastic
    const tmax_opts = {
        delay: 0.2,
        repeat: 0,
        repeatDelay: 0.5,
      };
      
      let tmax_tl           = new TimelineMax(tmax_opts),
          polyland_stagger  = 0.00475,
          polyland_duration = 1.5;
      CSSPlugin.useSVGTransformAttr = true; // Thanks Jack Doyle@GreenSock for the tip!
      
      const polyland_staggerFrom = {
        scale: 0,
        opacity: 0,
        transformOrigin: 'center center',
        ease: Elastic.easeInOut,
        force3D: true
      };
      
      const polyland_staggerTo = {
        opacity: 1,
        scale: 1,
        ease: Elastic.easeInOut,
        force3D: true
      };
      
      useEffect(()=> {
        let polyland_shapes   = document.querySelectorAll('svg.landscape polygon')
        polyland_shapes = [...polyland_shapes, document.querySelectorAll('svg.landscape path')]
        tmax_tl.staggerFromTo(polyland_shapes, polyland_duration, polyland_staggerFrom, polyland_staggerTo, polyland_stagger, 0);
      },[])
  return (
    <PolyMountains />
  )
}
