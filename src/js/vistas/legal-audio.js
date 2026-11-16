// Vista: Audio y transcripción sincronizada (wireframe W-25)
import '../../styles/vistas/legal-audio.css';

export default {
  render: (ctx) => `
        <div class="pagina v-legal-audio">
            <p class="migas">Área legal › Evidencia › RCL-2041</p>
            <h1 class="pagina__titulo">Llamada de reporte del siniestro</h1>
            <section class="tarjeta reproductor">
                <button type="button" class="reproductor__play"  aria-label="Reproducir" aria-pressed="false" data-reproducir>▶</button>
                <svg viewBox="0 0 320 30" preserveAspectRatio="none" role="img" aria-label="Onda de audio"><rect x="0" y="7" width="3" height="16" rx="1" fill="#1f2937"/><rect x="5" y="10" width="3" height="10" rx="1" fill="#1f2937"/><rect x="10" y="6" width="3" height="18" rx="1" fill="#1f2937"/><rect x="15" y="2" width="3" height="26" rx="1" fill="#1f2937"/><rect x="20" y="12" width="3" height="7" rx="1" fill="#1f2937"/><rect x="25" y="11" width="3" height="8" rx="1" fill="#1f2937"/><rect x="30" y="4" width="3" height="23" rx="1" fill="#1f2937"/><rect x="35" y="11" width="3" height="9" rx="1" fill="#1f2937"/><rect x="40" y="7" width="3" height="17" rx="1" fill="#1f2937"/><rect x="45" y="3" width="3" height="24" rx="1" fill="#1f2937"/><rect x="50" y="12" width="3" height="7" rx="1" fill="#1f2937"/><rect x="55" y="4" width="3" height="22" rx="1" fill="#1f2937"/><rect x="60" y="9" width="3" height="12" rx="1" fill="#1f2937"/><rect x="65" y="12" width="3" height="7" rx="1" fill="#1f2937"/><rect x="70" y="11" width="3" height="8" rx="1" fill="#1f2937"/><rect x="75" y="6" width="3" height="19" rx="1" fill="#1f2937"/><rect x="80" y="6" width="3" height="19" rx="1" fill="#1f2937"/><rect x="85" y="11" width="3" height="8" rx="1" fill="#1f2937"/><rect x="90" y="9" width="3" height="13" rx="1" fill="#1f2937"/><rect x="95" y="11" width="3" height="8" rx="1" fill="#1f2937"/><rect x="100" y="4" width="3" height="23" rx="1" fill="#1f2937"/><rect x="105" y="6" width="3" height="19" rx="1" fill="#1f2937"/><rect x="110" y="12" width="3" height="7" rx="1" fill="#1f2937"/><rect x="115" y="3" width="3" height="24" rx="1" fill="#1f2937"/><rect x="120" y="11" width="3" height="9" rx="1" fill="#1f2937"/><rect x="125" y="9" width="3" height="13" rx="1" fill="#1f2937"/><rect x="130" y="2" width="3" height="26" rx="1" fill="#1f2937"/><rect x="135" y="2" width="3" height="26" rx="1" fill="#1f2937"/><rect x="140" y="3" width="3" height="24" rx="1" fill="#1f2937"/><rect x="145" y="12" width="3" height="7" rx="1" fill="#1f2937"/><rect x="150" y="3" width="3" height="24" rx="1" fill="#1f2937"/><rect x="155" y="3" width="3" height="24" rx="1" fill="#1f2937"/><rect x="160" y="6" width="3" height="18" rx="1" fill="#1f2937"/><rect x="165" y="12" width="3" height="7" rx="1" fill="#1f2937"/><rect x="170" y="9" width="3" height="13" rx="1" fill="#1f2937"/><rect x="175" y="12" width="3" height="7" rx="1" fill="#1f2937"/><rect x="180" y="4" width="3" height="23" rx="1" fill="#1f2937"/><rect x="185" y="10" width="3" height="10" rx="1" fill="#1f2937"/><rect x="190" y="8" width="3" height="15" rx="1" fill="#cbd2dd"/><rect x="195" y="6" width="3" height="19" rx="1" fill="#cbd2dd"/><rect x="200" y="10" width="3" height="10" rx="1" fill="#cbd2dd"/><rect x="205" y="11" width="3" height="9" rx="1" fill="#cbd2dd"/><rect x="210" y="8" width="3" height="15" rx="1" fill="#cbd2dd"/><rect x="215" y="10" width="3" height="11" rx="1" fill="#cbd2dd"/><rect x="220" y="11" width="3" height="9" rx="1" fill="#cbd2dd"/><rect x="225" y="9" width="3" height="12" rx="1" fill="#cbd2dd"/><rect x="230" y="7" width="3" height="17" rx="1" fill="#cbd2dd"/><rect x="235" y="11" width="3" height="9" rx="1" fill="#cbd2dd"/><rect x="240" y="11" width="3" height="8" rx="1" fill="#cbd2dd"/><rect x="245" y="12" width="3" height="7" rx="1" fill="#cbd2dd"/><rect x="250" y="9" width="3" height="12" rx="1" fill="#cbd2dd"/><rect x="255" y="5" width="3" height="21" rx="1" fill="#cbd2dd"/><rect x="260" y="6" width="3" height="19" rx="1" fill="#cbd2dd"/><rect x="265" y="7" width="3" height="16" rx="1" fill="#cbd2dd"/><rect x="270" y="5" width="3" height="20" rx="1" fill="#cbd2dd"/><rect x="275" y="5" width="3" height="20" rx="1" fill="#cbd2dd"/><rect x="280" y="7" width="3" height="17" rx="1" fill="#cbd2dd"/><rect x="285" y="8" width="3" height="15" rx="1" fill="#cbd2dd"/><rect x="290" y="9" width="3" height="13" rx="1" fill="#cbd2dd"/><rect x="295" y="10" width="3" height="11" rx="1" fill="#cbd2dd"/><rect x="300" y="9" width="3" height="13" rx="1" fill="#cbd2dd"/><rect x="305" y="11" width="3" height="8" rx="1" fill="#cbd2dd"/><rect x="310" y="8" width="3" height="15" rx="1" fill="#cbd2dd"/><rect x="315" y="4" width="3" height="22" rx="1" fill="#cbd2dd"/></svg>
                <span class="reproductor__tiempo">01:12 / 03:40 &nbsp; 1× ▾</span>
            </section>
            <div class="audio">
                <section class="tarjeta">
                    <h2>Transcripción</h2>
                    <ul class="transcripcion">
                        <li><b>00:48</b><span>Agente</span><p>Buenas tardes, línea de reporte de siniestros.</p></li>
                        <li><b>01:03</b><span>Cliente</span><p>Quiero reportar un choque ocurrido ayer.</p></li>
                        <li class="activa"><b>01:12</b><span>Cliente</span><p>Ocurrió en la avenida principal por la noche.</p></li>
                        <li><b>01:25</b><span>Agente</span><p>¿Hubo lesionados en el accidente?</p></li>
                    </ul>
                </section>
                <aside class="tarjeta">
                    <h2>Datos de la llamada</h2>
                    <dl class="datos-v">
                        <dt>Fecha</dt><dd>dd/mm/aaaa</dd><dt>Duración</dt><dd>03:40</dd><dt>Canal</dt><dd>Línea de reporte</dd>
                    </dl>
                </aside>
            </div>
            <p class="nota-pie"><a href="#/legal/expediente">← Volver al expediente legal</a></p>
        </div>
`,
};
