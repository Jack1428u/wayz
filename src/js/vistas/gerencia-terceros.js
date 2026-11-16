// Vista: Peritos externos y estudios jurídicos (wireframe W-36)
import '../../styles/vistas/gerencia-terceros.css';

export default {
  render: (ctx) => `
        <div class="pagina v-gerencia-terceros">
            <h1 class="pagina__titulo">Desempeño de terceros</h1>
            <div class="barra-superior">
                <div class="segmentos" role="group" aria-label="Filtro"><button type="button" class="boton boton--primario" data-segmento="Peritos externos" aria-pressed="true">Peritos externos</button><button type="button" class="boton" data-segmento="Estudios jurídicos" aria-pressed="false">Estudios jurídicos</button></div>
                <form class="filtros" novalidate><select><option>Ordenar</option></select><select><option>Periodo</option></select></form>
            </div>
            <h2 class="subtitulo-seccion">Peritos externos</h2>
            <section class="tarjeta">
                <table class="tabla">
                    <thead><tr><th>Perito</th><th>Casos</th><th>Tiempo promedio</th><th>Calidad del informe</th><th>Convenio</th></tr></thead>
                    <tbody>
                        <tr><td>Perito 1</td><td>24</td><td>2.1 días</td><td class="estrellas">★★★★☆</td><td>Renovar</td></tr>
                        <tr><td>Perito 2</td><td>18</td><td>3.4 días</td><td class="estrellas">★★★☆☆</td><td>Evaluar</td></tr>
                        <tr><td>Perito 3</td><td>9</td><td>5.0 días</td><td class="estrellas">★★☆☆☆</td><td>No renovar</td></tr>
                    </tbody>
                </table>
            </section>
            <h2 class="subtitulo-seccion">Estudios jurídicos externos</h2>
            <section class="tarjeta">
                <table class="tabla">
                    <thead><tr><th>Estudio</th><th>Casos ante Indecopi</th><th>Tasa de éxito</th><th>Calificación</th><th>Acción</th></tr></thead>
                    <tbody>
                        <tr><td>Estudio A</td><td>12</td><td>75 %</td><td class="estrellas">★★★★☆</td><td><button type="button" class="enlace-boton" data-accion>Calificar</button></td></tr>
                        <tr><td>Estudio B</td><td>8</td><td>50 %</td><td class="estrellas">★★★☆☆</td><td><button type="button" class="enlace-boton" data-accion>Calificar</button></td></tr>
                        <tr><td>Estudio C</td><td>5</td><td>80 %</td><td class="estrellas">★★★★★</td><td><button type="button" class="enlace-boton" data-accion>Calificar</button></td></tr>
                    </tbody>
                </table>
            </section>
            <p class="nota-pie"><a href="#/gerencia/reservas">Ver reservas y reportes →</a></p>
        </div>
`,
};
