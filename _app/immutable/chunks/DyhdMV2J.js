import{J as x,v as X,g as z,Z as W,L as $,K as j,_ as ee,N as ne,a0 as K,d as ie,a1 as te,a2 as V,a3 as oe,a4 as q,a5 as ae,a6 as re,W as se,o as R,y as F,T as le,q as de,w as ce,a7 as ue,x as G,z as H,A as B,Q as pe,a8 as me,a9 as k,aa as fe,F as U,I as Y,ab as O,ac as ge,ad as he,ae as be,af as ve,M as ye,G as we,R as ke}from"./DfdsIlbP.js";function _e(e,i){return i}function De(e,i,s){for(var d=[],m=i.length,r,a=i.length,f=0;f<m;f++){let b=i[f];Y(b,()=>{if(r){if(r.pending.delete(b),r.done.add(b),r.pending.size===0){var c=e.outrogroups;N(e,V(r.done)),c.delete(r),c.size===0&&(e.outrogroups=null)}}else a-=1},!1)}if(a===0){var o=d.length===0&&s!==null;if(o){var p=s,t=p.parentNode;ve(t),t.append(p),e.items.clear()}N(e,i,!o)}else r={pending:new Set(i),done:new Set},(e.outrogroups??=new Set).add(r)}function N(e,i,s=!0){var d;if(e.pending.size>0){d=new Set;for(const a of e.pending.values())for(const f of a)d.add(e.items.get(f).e)}for(var m=0;m<i.length;m++){var r=i[m];if(d?.has(r)){r.f|=k;const a=document.createDocumentFragment();ye(r,a)}else we(i[m],s)}}var J;function Me(e,i,s,d,m,r=null){var a=e,f=new Map,o=(i&K)!==0;if(o){var p=e;a=R?F(le(p)):p.appendChild(x())}R&&de();var t=null,b=ie(()=>{var u=s();return te(u)?u:u==null?[]:V(u)}),c,v=new Map,y=!0;function M(u){(E.effect.f&fe)===0&&(E.pending.delete(u),E.fallback=t,Ee(E,c,a,i,d),t!==null&&(c.length===0?(t.f&k)===0?U(t):(t.f^=k,A(t,null,a)):Y(t,()=>{t=null})))}function n(u){E.pending.delete(u)}var l=X(()=>{c=z(b);var u=c.length;let h=!1;if(R){var L=ce(a)===ue;L!==(u===0)&&(a=G(),F(a),H(!1),h=!0)}for(var C=new Set,g=$,P=ne(),S=0;S<u;S+=1){R&&B.nodeType===pe&&B.data===me&&(a=B,h=!0,H(!1));var w=c[S],T=d(w,S),D=y?null:f.get(T);D?(D.v&&W(D.v,w),D.i&&W(D.i,S),P&&g.unskip_effect(D.e)):(D=Ce(f,y?a:J??=x(),w,T,S,m,i,s),y||(D.e.f|=k),f.set(T,D)),C.add(T)}if(u===0&&r&&!t&&(y?t=j(()=>r(a)):(t=j(()=>r(J??=x())),t.f|=k)),u>C.size&&ee(),R&&u>0&&F(G()),!y)if(v.set(g,C),P){for(const[Z,Q]of f)C.has(Z)||g.skip_effect(Q.e);g.oncommit(M),g.ondiscard(n)}else M(g);h&&H(!0),z(b)}),E={effect:l,items:f,pending:v,outrogroups:null,fallback:t};y=!1,R&&(a=B)}function I(e){for(;e!==null&&(e.f&he)===0;)e=e.next;return e}function Ee(e,i,s,d,m){var r=(d&be)!==0,a=i.length,f=e.items,o=I(e.effect.first),p,t=null,b,c=[],v=[],y,M,n,l;if(r)for(l=0;l<a;l+=1)y=i[l],M=m(y,l),n=f.get(M).e,(n.f&k)===0&&(n.nodes?.a?.measure(),(b??=new Set).add(n));for(l=0;l<a;l+=1){if(y=i[l],M=m(y,l),n=f.get(M).e,e.outrogroups!==null)for(const w of e.outrogroups)w.pending.delete(n),w.done.delete(n);if((n.f&k)!==0)if(n.f^=k,n===o)A(n,null,s);else{var E=t?t.next:o;n===e.effect.last&&(e.effect.last=n.prev),n.prev&&(n.prev.next=n.next),n.next&&(n.next.prev=n.prev),_(e,t,n),_(e,n,E),A(n,E,s),t=n,c=[],v=[],o=I(t.next);continue}if((n.f&O)!==0&&(U(n),r&&(n.nodes?.a?.unfix(),(b??=new Set).delete(n))),n!==o){if(p!==void 0&&p.has(n)){if(c.length<v.length){var u=v[0],h;t=u.prev;var L=c[0],C=c[c.length-1];for(h=0;h<c.length;h+=1)A(c[h],u,s);for(h=0;h<v.length;h+=1)p.delete(v[h]);_(e,L.prev,C.next),_(e,t,L),_(e,C,u),o=u,t=C,l-=1,c=[],v=[]}else p.delete(n),A(n,o,s),_(e,n.prev,n.next),_(e,n,t===null?e.effect.first:t.next),_(e,t,n),t=n;continue}for(c=[],v=[];o!==null&&o!==n;)(p??=new Set).add(o),v.push(o),o=I(o.next);if(o===null)continue}(n.f&k)===0&&c.push(n),t=n,o=I(n.next)}if(e.outrogroups!==null){for(const w of e.outrogroups)w.pending.size===0&&(N(e,V(w.done)),e.outrogroups?.delete(w));e.outrogroups.size===0&&(e.outrogroups=null)}if(o!==null||p!==void 0){var g=[];if(p!==void 0)for(n of p)(n.f&O)===0&&g.push(n);for(;o!==null;)(o.f&O)===0&&o!==e.fallback&&g.push(o),o=I(o.next);var P=g.length;if(P>0){var S=(d&K)!==0&&a===0?s:null;if(r){for(l=0;l<P;l+=1)g[l].nodes?.a?.measure();for(l=0;l<P;l+=1)g[l].nodes?.a?.fix()}De(e,g,S)}}r&&ge(()=>{if(b!==void 0)for(n of b)n.nodes?.a?.apply()})}function Ce(e,i,s,d,m,r,a,f){var o=(a&ae)!==0?(a&re)===0?se(s,!1,!1):q(s):null,p=(a&oe)!==0?q(m):null;return{v:o,i:p,e:j(()=>(r(i,o??s,p??m,f),()=>{e.delete(d)}))}}function A(e,i,s){if(e.nodes)for(var d=e.nodes.start,m=e.nodes.end,r=i&&(i.f&k)===0?i.nodes.start:s;d!==null;){var a=ke(d);if(r.before(d),d===m)return;d=a}}function _(e,i,s){i===null?e.effect.first=s:i.next=s,s===null?e.effect.last=i:s.prev=i}const Pe=[{id:"PRJ-26-03",slug:"e-spin",name:"E-Spin",date:new Date("2026-03-26"),year:2026,domains:["Electronics","Software"],description:`E-Spin rethinks how and where prototyping happens.

Traditional development boards stay on desks. E-Spin is designed to stay with you.

- ESP32-C3 microcontroller (WiFi + Bluetooth)
- 12 exposed GPIO pins (I2C, power rails, etc.)
- 8 addressable RGB LEDs
- USB-C programming & charging
- Onboard LiPo battery with battery management
- Integrated 9 axis IMU
- Dual-purpose PCB design with embedded reference guide
- Fidget spinner form factor with 698ZZ bearing

This enables rapid experimentation anywhere — from quick sensor tests to wireless prototypes — without needing a full lab setup.

### What Makes It Different

E-Spin is not a gadget pretending to be a dev board.
It is a fully capable dev board that happens to be enjoyable to use.

Always accessible → encourages spontaneous prototyping
Physical interaction (spin, motion) → new input possibilities
Embedded reference PCB → practical engineering aid
Plug-and-play GPIO → immediate hardware integration

The form factor is not cosmetic — it directly impacts usability and adoption.

## My Role

I led the electronics, product design, and technical execution of the project:

#### Hardware & Embedded Systems
- Designed the complete electronic architecture
- Developed and iterated on PCB layouts (V1 → V3)
- Selected components, validated, and integrated (ESP32-C3, power, LEDs, IMU)
- Prototyped, debugged, and brought up the hardware
#### Manufacturing & Production
- Sourced components and manufacturing partners
- Defined DFM (Design for Manufacturing) constraints
- Set up assembly workflows and validation processes
- Managed transition from hand-soldered prototypes → factory production
#### Product & Creative Direction
- Created 3D renders (Blender) and visual assets
- Designed campaign visuals and UI elements (Figma)
- Produced content for Kickstarter and social media
- Structured and launched the crowdfunding campaign
#### Collaboration
Alexandre focused on mechanical design (form factor, tolerances) and project logistics (budgeting, forecasting)
Close collaboration ensured tight integration between electronics and mechanical constraints
### Results (Kickstarter Launch)
- Funded in under 7.5 hours
- 200% funded within 7 days
- 59 backers / €2,037 pledged (week 1)
- International demand across Europe and beyond
- Featured by external platforms (e.g., Hackster.io)`,skills_used:["KiCAD","Industrial Design","Crowdfunding"],images:["/assets/images/ESPIN/Hero.png","/assets/images/ESPIN/Exploded_details_big.png"],models_3d:["/assets/models/Handspinner.glb"],hotspots_per_model:[[{position:[-1.25,-.5,0],label:"LiPo Battery",description:"Rechargeable battery providing up to 8 hours of continuous use, with USB-C charging and built-in protection circuitry."},{position:[1.5,-.5,0],label:"ESP32 C3 mini",description:"Low-power microcontroller with integrated Wi-Fi and Bluetooth connectivity, serving as the brain of the E-Spin board."},{position:[.8,-.6,0],label:"IMU",description:"High precison 6 axis Inertial Mersurment Unit, capable of Wake on Motion and include a podometer"},{position:[.9,-.45,.5],label:"GPIOs",description:"12 General Purpose Input/Output pins for connecting sensors, actuators, and other peripherals, with support for I2C, SPI, ADC and PWM interfaces."},{position:[-1.1,-.7,0],label:"LED ribbon",description:"Fully addressable RGB LED strip with 8 LEDs, allowing for customizable lighting effects and visual feedback for your projects."}],[]],links:[{type:"github",label:"Repository",url:"https://github.com/E-spin-fr"},{type:"website",label:"E-Spin Website",url:"https://docs.e-spin.fr"},{type:"website",label:"Kickstarter Campaign",url:"https://www.kickstarter.com/projects/322093471/e-spin?ref=1ty49a"}]},{id:"PRJ-25-09",slug:"smartlock",name:"Smart Lock",date:new Date("2025-09-25"),year:2025,domains:["Electronics","Software"],description:`A NFC and Bluetooth enabled smart lock designed to secure the locker of DaVinciBot, without the need for code, and working with the students card of our members. The lock is designed to be easily installable on any locker and provides a secure and convenient way for members to access their belongings.

## My Role		
I led the project end-to-end, from initial concept to final deployment, with support at the end for the mechanical design and integration, in order to teach the new members of DaVinciBot the process of designing and building a complete hardware product:
- Hardware design and prototyping (KiCAD)
- Firmware development (C++ on ESP32-C3)
- Mechanical integration and 3D modeling (SOLIDWORKS for CAD, Blender for 3D rendering)
- Testing, iteration, and deployment in the locker room`,skills_used:["KiCAD","Analog Design","Firmware Development"],images:[],model_3d:"/assets/models/smartlock.glb",hotspots:[{position:[-.4,0,-.55],label:"STM NFC Chip",description:"NFC controller for secure communication with student cards, enabling keyless access to lockers. Support Interupt to save battery life"},{position:[.1,-.1,-1.1],label:"Matching circuit",description:"Match the parameter of the antenna use to receive the RF signal"},{position:[-.8,-.1,1.1],label:"Power circuit",description:"Reduce the 9v comming from the LiPo battery to 3.3v and 5v"},{position:[1.2,.1,0],label:"ESP32 C3 Mini",description:"Low-power microcontroller with integrated Wi-Fi and Bluetooth connectivity, serving as the brain of the smart lock. "}],links:[{type:"website",label:"Website",url:"https://davincibot.fr"}]},{id:"PRJ-25-04",slug:"cdr",name:"French Robotic cup",date:new Date("2025-05-15"),year:2025,domains:["Electronics","Mechanical","Management"],description:`Designed and developed a fleet of autonomous robots for a european robotics competition involving 100+ teams and real-time matches.
Led a 12-member multidisciplinary team while contributing to embedded systems, communication architecture, and decision-making algorithms.

### Problem & Objectives

The French Robotic Cup is a yearly engineering competition where fully autonomous robots compete in 100-second matches under strict constraints (no remote control, dynamic environment, evolving rules each year).

Key challenges:

- Build a fully custom autonomous system (LiDAR, decision-making, actuation)
- Ensure robust communication in a highly noisy environment (100+ robots operating simultaneously, whether on the match or the padocks)
- Coordinate multiple robots acting as a system, not individually
- Deliver a competition-ready robot before deadline, enabling full system testing

Objective:
Develop a reliable, competitive robotic system capable of executing a full match strategy autonomously and consistently.

### My Contributions

#### Technical (Embedded & Systems):

- Designed a custom inter-board communication protocol (“Intercom”)
- Implemented parts of the robot position control system (closed-loop control)
- Contributed to decision-making algorithms governing robot behavior during matches
- Developed low-frequency wireless communication (LoRa, ~400 MHz) for multi-robot coordination
- Programmed autonomous robots in C/C++ on custom ESP32-S3 PCBs

#### System Architecture:

- Designed communication enabling coordinated multi-robot strategies
- Ensured robustness against RF interference in a congested competition environment

#### Project Management:

- Led a team of 12 students, all of them more experienced/older
- Structured the project lifecycle around Agile-based principles
- Drove team motivation and alignment toward a shared competitive goal
- Enforced early delivery milestones to enable earlier software integration

### Approach & Technical Work

The project involved building:

- A main autonomous robot
- Several secondary robots
- A communication system allowing them to work together as a coordinated fleet

The goal was not just to build robots, but to make them collaborate intelligently in real time.

### Technical Breakdown

#### Embedded Systems & Control

Microcontrollers: ESP32-S3 (custom PCB)
Languages: C / C++
Implemented position control (closed-loop control):
Sensor feedback → error computation → motor correction
Ensures precise movement under dynamic conditions

#### Communication Architecture

- Designed a custom protocol (Intercom) for inter-board communication, in Python and C++
- Implemented LoRa-based communication (~400 MHz):
	+ Lower frequency → better penetration and reduced interference
	+ Critical in an environment with dozens of competing RF systems

#### Multi-Robot Coordination

Distributed architecture:
- Each robot operates autonomously
- Shared information (LiDAR data) enables coordinated actions and improves situational awareness and pathplanning
- Enabled task distribution and synchronization across robots

#### Decision-Making System

Designed logic for:
- Action prioritization
- Match strategy execution
- Real-time adaptation to the opponent during the 100-second match`,skills_used:["C++","PCB Design","Solidworks","Management"],model_3d:"/assets/models/cdr2025.glb",images:["/assets/images/CDR/cdr25.jpg","/assets/images/CDR/cdr24.webp","/assets/images/CDR/equipe25.jpg"],links:[{type:"github",label:"Repository",url:"https://github.com/davincibot/CoupeDeRobotique"},{type:"website",label:"Website",url:"https://davincibot.fr"}]},{id:"PRJ-25-02",slug:"president-davincibot",name:"President of DaVinciBot",date:new Date("2025-02-20"),year:2025,domains:["Management"],description:"Elected President of DaVinciBot, the robotics club of ESILV engineering school. Oversaw a team of 130+ members, organized workshops and events, and led the club to new heights in terms of project quality and member engagement.",skills_used:["Leadership","Growth Strategy","Stategic planning","Conflit Resolution"],images:["/assets/images/Pres/dvb.jpg"],links:[{type:"website",label:"Website",url:"https://davincibot.fr"},{type:"linkedin",label:"LinkedIn",url:"https://linkedin.com/company/davincibot"}]},{id:"PRJ-24-02",slug:"treso-davincibot",name:"Treasurer of DaVinciBot",date:new Date("2024-02-20"),year:2024,domains:["Management"],description:"Served as Treasurer of DaVinciBot, the robotics club of ESILV engineering school. Managed the club's finances, made budget forecasts, added compliance measures, and ensured transparent financial reporting.",skills_used:["Accounting","Excel","Financial Planning"],images:["/assets/images/Pres/dvb.jpg"],links:[{type:"website",label:"Website",url:"https://davincibot.fr"},{type:"linkedin",label:"LinkedIn",url:"https://linkedin.com/company/davincibot"}]},{id:"PRJ-24-01",slug:"respo-module-emlv",name:"Module coordinator at EMLV",date:new Date("2024-01-20"),year:2024,domains:["Other"],description:'Served as module coordinator for the "Technological development and innovation" module at EMLV, an Top 3 post-sixth-form Buisness School in France. Coordinated a team of 20+ teachers, designed the curriculum, and ensured the successful delivery of the module to 1,000+ students for two consecutive years.',skills_used:["Project Management","Curriculum Design","Team Coordination"],images:["/assets/images/EMLV/EMLV-1.jpg"],links:[{type:"website",label:"Website",url:"https://emlv.fr"}]},{id:"PRJ-25-08",slug:"cohoma",name:"CoHoMa",date:new Date("2025-08-20"),year:2025,domains:["Software"],description:`CoHoMa focuses on collaboration between humans and machines.

Each challenge demands a sustained pace, rapid threat identification, and the ability to explore low-visibility areas.

## Our Approach

Our response combines:

- SLAM-based iSAM2, with sensors fusion navigation and advanced compression techniques for efficient information exchange over low-bandwidth links
- Assisted navigation with a focus on intuitive human-machine interaction, enabling operators to maintain situational awareness without cognitive overload
- An operator interface that guides decisions without overloading attention`,skills_used:["ROS2","Gazebo","C/C++","Python"],images:["/assets/images/COHOMA/cohoma.png"],links:[{type:"website",label:"Website",url:"https://davincibot.fr"},{type:"linkedin",label:"LinkedIn",url:"https://linkedin.com/company/davincibot"}]},{id:"PRJ-25-11",slug:"drone-defense-hackathon",name:"Drone Defense Hackathon",date:new Date("2025-11-10"),year:2025,domains:["Software","Electronics"],description:`Participated in the Drone Defense Hackathon, a major European defense innovation event held at the Grand Palais in Paris, bringing together 200+ engineering students (selected from thousands) to design and prototype drone-based solutions for real-world military use cases.

As President of DaVinciBot, I led the initiative end-to-end:

- Recruited and structured a multidisciplinary team of engineers
- Managed the application process and secured our team's selection among highly competitive candidates
- Defined the technical direction and coordinated execution during the hackathon

Over an intensive 48 hour cycle, we developed a functional prototype addressing drone communication and operational constraints in contested environments.

A key contribution was the design and implementation of a real-time video transmission system using low-frequency RF, enabling more robust communication in environments where conventional links are unreliable. This component was engineered with reusability in mind and is now a foundation for future DaVinciBot projects.

Beyond the technical deliverable, the experience involved:

- Rapid prototyping and testing in a 1,000 m² live drone arena
- Iterating under real-world constraints inspired by defense scenarios
- Engaging with mentors, defense experts, and AI specialists to validate and challenge our approach

Although the project did not reach the final stage, the technical feedback confirmed the relevance and scalability of our solution, particularly regarding resilient communication systems for drones.

This experience strengthened my ability to:

- Lead high-performing teams under pressure
- Translate complex constraints into actionable engineering solutions
- Build systems with both practical deployment considerations and long-term reuse in mind
		`,skills_used:["LoRa","GNSS","Embedded Systems"],images:["/assets/images/DDH/ddh.jpg","/assets/images/DDH/ddh1.jpg","/assets/images/DDH/ddh2.jpg","/assets/images/DDH/grandpalais.webp"],links:[{type:"website",label:"Blog post",url:"https://davincibot.fr/blog/davincibot-selectionne-pour-le-drone-defense-hackathon/"},{type:"website",label:"Registration",url:"https://www.agorize.com/en/challenges/drone-defense-hackathon"},{type:"website",label:"French Military blog post",url:"https://www.defense.gouv.fr/terre/actualites/drone-defense-hackathon-collaboration-entre-larmee-jeunesse-ingenieure"}]}];export{Me as e,_e as i,Pe as p};
