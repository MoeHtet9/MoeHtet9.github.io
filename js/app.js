$(document).ready(function () {
  const $window = $(window);
  const $navbar = $('#mainNav');
  const $backToTop = $('.back-top');
  const $navLinks = $('.nav-link');
  const $navMenu = $('#navMenu');

  // Keep the footer year current.
  $('#year').text(new Date().getFullYear());

  // Update navigation state and reveal elements while scrolling.
  function updatePage() {
    const scrollTop = $window.scrollTop();
    const viewportBottom = scrollTop + $window.height();

    $navbar.toggleClass('scrolled', scrollTop > 35);
    $backToTop.toggleClass('show', scrollTop > 450);

    $navLinks.each(function () {
      const $link = $(this);
      const $section = $($link.attr('href'));

      if (!$section.length) return;

      const sectionTop = $section.offset().top - 150;
      const sectionBottom = sectionTop + $section.outerHeight();
      const isActive = scrollTop >= sectionTop && scrollTop < sectionBottom;

      if (isActive) {
        $navLinks.removeClass('active');
        $link.addClass('active');
      }
    });

    $('.reveal:not(.visible)').each(function () {
      const $element = $(this);
      const elementTop = $element.offset().top;

      if (viewportBottom > elementTop + 45) {
        $element.addClass('visible');

        $element.find('.progress-bar').each(function () {
          const width = $(this).data('width');
          $(this).css('width', width);
        });
      }
    });
  }

  // Use a single handler for scroll and resize events.
  $window.on('scroll resize', updatePage);
  updatePage();

  // Close the mobile menu after selecting a navigation item.
  $('.nav-link, #navMenu .btn-main, .hero-actions a, .brand, .back-top').on('click', function () {
    $navMenu.removeClass('show');
  });

  // Front-end demo only. Connect this form to a Laravel endpoint to send messages.
  $('#contactForm').on('submit', function (event) {
    event.preventDefault();
    $('#formMessage').text(
      'Thanks! Connect this form to your Laravel mail route to receive messages.'
    );
    this.reset();
  });

  /* ==============================
    CUSTOM MOUSE FOLLOWER
  ============================== */
    const cursor = $('.cursor-glow');

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    $(document).on('mousemove', function (e) {

        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.addClass('active');

    });

    function animateCursor() {

        currentX += (mouseX - currentX) * 0.32;
        currentY += (mouseY - currentY) * 0.32;

        cursor.css({
            left: currentX + 'px',
            top: currentY + 'px'
        });

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    $(document).on('mouseleave', function () {
        cursor.removeClass('active');
    });

    $(document).on('mouseenter', function () {
        cursor.addClass('active');
    });

    // Digital globe animation
      const canvas = document.getElementById('earth');
      const ctx = canvas.getContext('2d');
      const power = document.getElementById('power');
      
      let width = 0, height = 0, dpr = 1;
      let angle = 0, tilt = -0.12;
      let dragging = false, lastX = 0, lastY = 0, lastT = 0, velocity = .0015;
      let lightsOn = false;
      const TAU = Math.PI * 2;

      // Simplified geographic outlines (longitude, latitude)
      const land = [
        [[-168,72],[-145,70],[-130,55],[-124,48],[-126,30],[-112,27],[-98,16],[-82,9],[-78,25],[-80,32],[-65,45],[-58,53],[-82,60],[-95,72],[-120,75],[-145,72]],
        [[-81,12],[-70,9],[-60,-5],[-52,-15],[-58,-34],[-68,-55],[-76,-42],[-80,-15]],
        [[-17,36],[-5,37],[10,35],[25,31],[33,20],[43,12],[50,-12],[40,-26],[28,-35],[17,-34],[10,-18],[0,-5],[-8,5],[-16,18]],
        [[-10,36],[-17,48],[-5,58],[10,62],[25,70],[40,68],[55,58],[45,48],[30,42],[20,36],[5,42]],
        [[35,68],[60,72],[90,72],[120,62],[145,55],[165,60],[178,50],[155,42],[140,35],[125,22],[110,8],[98,8],[80,20],[65,25],[55,40],[42,48]],
        [[68,25],[78,8],[88,8],[94,20],[85,28],[75,32]],
        [[112,-11],[130,-10],[151,-17],[154,-28],[145,-39],[128,-43],[115,-33]],
        [[-52,60],[-42,60],[-35,72],[-45,82],[-58,78]],
        [[47,-13],[50,-16],[49,-25],[44,-22]]
      ];

      function resize() {
        const r = canvas.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = r.width;
        height = r.height;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function project(lon, lat, R, spin = angle) {
        const L = (lon * Math.PI / 180) + spin;
        const B = lat * Math.PI / 180;
        const x = Math.cos(B) * Math.sin(L);
        const y = Math.sin(B);
        const z = Math.cos(B) * Math.cos(L);
        const yy = y * Math.cos(tilt) - z * Math.sin(tilt);
        const zz = y * Math.sin(tilt) + z * Math.cos(tilt);
        return { x: width / 2 + x * R, y: height / 2 - yy * R, z: zz };
      }

      function pathLand(poly, R) {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < poly.length; i++) {
          const p = project(poly[i][0], poly[i][1], R);
          if (p.z > 0.015) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else if (started) {
            ctx.closePath();
            started = false;
          }
        }
        if (started) ctx.closePath();
      }

      function drawGrid(R) {
        ctx.lineWidth = .65;
        for (let lat = -75; lat <= 75; lat += 15) {
          ctx.beginPath();
          let open = false;
          for (let lon = -180; lon <= 180; lon += 3) {
            const p = project(lon, lat, R);
            if (p.z > 0) {
              if (!open) { ctx.moveTo(p.x, p.y); open = true; }
              else { ctx.lineTo(p.x, p.y); }
            } else {
              open = false;
            }
          }
          ctx.strokeStyle = lightsOn ? 'rgba(93,226,255,.25)' : 'rgba(93,180,220,.14)';
          ctx.stroke();
        }
        for (let lon = -180; lon < 180; lon += 15) {
          ctx.beginPath();
          let open = false;
          for (let lat = -90; lat <= 90; lat += 2) {
            const p = project(lon, lat, R);
            if (p.z > 0) {
              if (!open) { ctx.moveTo(p.x, p.y); open = true; }
              else { ctx.lineTo(p.x, p.y); }
            } else {
              open = false;
            }
          }
          ctx.strokeStyle = lightsOn ? 'rgba(93,226,255,.23)' : 'rgba(93,180,220,.13)';
          ctx.stroke();
        }
      }

      function drawLand(R) {
        land.forEach((poly) => {
          pathLand(poly, R);
          ctx.fillStyle = lightsOn ? 'rgba(23,154,170,.48)' : 'rgba(13,83,115,.35)';
          ctx.strokeStyle = lightsOn ? 'rgba(94,246,255,.85)' : 'rgba(62,175,210,.48)';
          ctx.lineWidth = lightsOn ? 1.15 : .8;
          ctx.fill();
          ctx.stroke();
        });
      }

      function drawNetwork(R) {
        const points = [];
        for (let lat = -55; lat <= 70; lat += 13) {
          for (let lon = -170; lon <= 180; lon += 17) {
            const v = Math.sin(lon * 12.9898 + lat * 78.233) * 43758.5453;
            if ((v - Math.floor(v)) > .69) {
              const p = project(lon, lat, R);
              if (p.z > .08) points.push(p);
            }
          }
        }
        ctx.save();
        ctx.lineWidth = .7;
        points.forEach((p, i) => {
          let nearest = null, dist = Infinity;
          for (let j = i + 1; j < Math.min(i + 9, points.length); j++) {
            const q = points[j], d = (p.x - q.x) ** 2 + (p.y - q.y) ** 2;
            if (d < dist) { dist = d; nearest = q; }
          }
          if (nearest && dist < R * R * .055) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(nearest.x, nearest.y);
            ctx.strokeStyle = lightsOn ? 'rgba(58,232,255,.32)' : 'rgba(58,180,220,.15)';
            ctx.stroke();
          }
        });
        points.forEach((p, i) => {
          const size = (i % 7 === 0) ? 2.1 : 1.15;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, TAU);
          ctx.fillStyle = lightsOn ? 'rgba(143,255,255,.95)' : 'rgba(84,204,235,.55)';
          ctx.fill();
        });
        ctx.restore();
      }

      function drawArcs(R) {
        const cities = [[-74,40],[-0.1,51.5],[139.7,35.7],[103.8,1.3],[77.2,28.6],[151,-33.8],[-118,34],[18.4,-33.9]];
        const links = [[0,1],[1,2],[1,4],[2,3],[3,5],[0,6],[4,7],[3,4]];
        
        links.forEach(([a, b]) => {
          const A = project(...cities[a], R), B = project(...cities[b], R);
          if (A.z <= 0 || B.z <= 0) return;
          const mx = (A.x + B.x) / 2 - width / 2, my = (A.y + B.y) / 2 - height / 2;
          const lift = R * .22;
          
          ctx.beginPath();
          ctx.moveTo(A.x, A.y);
          ctx.quadraticCurveTo(width / 2 + mx * .55, height / 2 + my * .55 - lift, B.x, B.y);
          ctx.strokeStyle = lightsOn ? 'rgba(77,244,255,.55)' : 'rgba(54,174,219,.22)';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          [A, B].forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.3, 0, TAU);
            ctx.fillStyle = lightsOn ? '#a7ffff' : '#4cbbdb';
            ctx.fill();
          });
        });
      }

      function draw() {
        ctx.clearRect(0, 0, width, height);
        const R = Math.min(width, height) * .385;
        
        // Glow effect
        const glow = ctx.createRadialGradient(width / 2, height / 2, R * .78, width / 2, height / 2, R * 1.25);
        glow.addColorStop(0, lightsOn ? 'rgba(20,175,255,.19)' : 'rgba(12,90,150,.09)');
        glow.addColorStop(.72, lightsOn ? 'rgba(30,130,255,.12)' : 'rgba(20,80,130,.05)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, R * 1.25, 0, TAU);
        ctx.fill();

        // Sphere background
        const sphere = ctx.createRadialGradient(width / 2 - R * .32, height / 2 - R * .38, R * .05, width / 2, height / 2, R);
        sphere.addColorStop(0, lightsOn ? '#1a6b87' : '#0a2a43');
        sphere.addColorStop(.55, lightsOn ? '#073c61' : '#061d34');
        sphere.addColorStop(1, '#010914');
        
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, R, 0, TAU);
        ctx.fillStyle = sphere;
        ctx.fill();
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, R, 0, TAU);
        ctx.clip();
        
        drawLand(R);
        drawGrid(R);
        drawNetwork(R);
        drawArcs(R);
        
        const shade = ctx.createRadialGradient(width / 2 - R * .25, height / 2 - R * .3, R * .45, width / 2, height / 2, R * 1.08);
        shade.addColorStop(0, 'rgba(0,0,0,0)');
        shade.addColorStop(.72, 'rgba(0,0,0,.06)');
        shade.addColorStop(1, lightsOn ? 'rgba(0,4,16,.62)' : 'rgba(0,3,12,.82)');
        
        ctx.fillStyle = shade;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, R, 0, TAU);
        ctx.strokeStyle = lightsOn ? 'rgba(99,239,255,.9)' : 'rgba(61,157,203,.48)';
        ctx.lineWidth = lightsOn ? 2 : 1.2;
        ctx.shadowColor = lightsOn ? '#26dfff' : 'transparent';
        ctx.shadowBlur = lightsOn ? 22 : 0;
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (lightsOn) {
          const shine = ctx.createRadialGradient(width / 2 - R * .48, height / 2 - R * .55, 0, width / 2 - R * .35, height / 2 - R * .35, R * .75);
          shine.addColorStop(0, 'rgba(255,255,255,.11)');
          shine.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = shine;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, R, 0, TAU);
          ctx.fill();
        }
      }

      function animate() {
        if (!dragging) {
          angle += velocity;
          velocity *= .985;
          if (Math.abs(velocity) < .00015) velocity = .0015;
        }
        draw();
        requestAnimationFrame(animate);
      }

      function down(e) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = performance.now();
        canvas.setPointerCapture?.(e.pointerId);
      }

      function move(e) {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        angle += dx * .008;
        tilt = Math.max(-.8, Math.min(.8, tilt + dy * .004));
        const now = performance.now();
        velocity = dx * .008;
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = now;
      }

      function up() {
        dragging = false;
      }

      // Event Listeners
      canvas.addEventListener('pointerdown', down);
      canvas.addEventListener('pointermove', move);
      canvas.addEventListener('pointerup', up);
      canvas.addEventListener('pointercancel', up);

      power.addEventListener('click', () => {
        lightsOn = !lightsOn;
        document.body.classList.toggle('lights-on', lightsOn);
        power.setAttribute('aria-pressed', String(lightsOn));
        power.innerHTML = lightsOn ? '◉ &nbsp; TURN LIGHTS OFF' : '◉ &nbsp; TURN LIGHTS ON';
      });

      window.addEventListener('resize', resize);
      
      // Initialize
      resize();
      animate();

});
