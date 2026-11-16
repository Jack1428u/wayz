// Vista: Mapa de calor de cláusulas (wireframe W-27)
import '../../styles/vistas/legal-mapa-calor.css';

export default {
  render: (ctx) => `
        <div class="pagina v-legal-mapa-calor">
            <p class="migas">Área legal › Contratos</p>
            <div class="encabezado">
                <h1 class="pagina__titulo">Mapa de calor – contrato traducido</h1>
                <a class="boton" href="#/legal/contratos">Volver a la traducción</a>
            </div>
            <div class="filtros-nivel" role="group" aria-label="Filtro">
                <button type="button" class="boton" data-segmento="Todos" aria-pressed="false">Todos</button><button type="button" class="boton boton--primario" data-segmento="Alto" aria-pressed="true">Alto</button><button type="button" class="boton" data-segmento="Medio" aria-pressed="false">Medio</button><button type="button" class="boton" data-segmento="Bajo" aria-pressed="false">Bajo</button>
            </div>
            <div class="mapa">
                <section class="tarjeta">
                        <div class="clausula"><span>Cláusula 1</span><div class="barra-cl barra-cl--alto"></div></div>
                        <div class="clausula"><span>Cláusula 2</span><div class="barra-cl barra-cl--bajo"></div></div>
                        <div class="clausula"><span>Cláusula 3</span><div class="barra-cl barra-cl--medio"></div></div>
                        <div class="clausula"><span>Cláusula 4</span><div class="barra-cl barra-cl--bajo"></div></div>
                        <div class="clausula"><span>Cláusula 5</span><div class="barra-cl barra-cl--alto"></div></div>
                        <div class="clausula"><span>Cláusula 6</span><div class="barra-cl barra-cl--medio"></div></div>
                    <div class="leyenda"><span><i class="barra-cl--alto"></i> Alto</span><span><i class="barra-cl--medio"></i> Medio</span><span><i class="barra-cl--bajo"></i> Bajo</span></div>
                </section>
                <aside class="tarjeta">
                    <h2>Cláusula 1 seleccionada</h2>
                    <p><span class="etiqueta etiqueta--gris">Ambigüedad: Alta</span></p>
                    <p class="detalle">Motivo: el término «pérdida total» puede interpretarse de dos maneras según la legislación local.</p>
                    <p class="detalle"><b>Referencia legal</b></p>
                    <p class="aviso-punteado">Norma local aplicable (enlace)</p>
                </aside>
            </div>
        </div>
`,
};
