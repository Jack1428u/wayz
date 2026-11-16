// Vista: Causal de exclusión de la póliza (wireframe W-28)
import '../../styles/vistas/legal-dictamen.css';

export default {
  render: (ctx) => `
        <div class="pagina v-legal-dictamen">
            <p class="migas">Área legal › Dictamen y plazos › RCL-2041</p>
            <div class="encabezado">
                <h1 class="pagina__titulo">Causal de exclusión</h1>
                <button type="button" class="boton boton--primario" data-dialog="firma">Ir a la firma</button>
            </div>
            <div class="causal">
                <section class="tarjeta">
                    <h2>Evidencias del caso</h2>
                    <label class="casilla"><input type="checkbox" checked> Facturas con importes repetidos</label>
                    <label class="casilla"><input type="checkbox" checked> Documento adulterado</label>
                    <label class="casilla"><input type="checkbox"> Fecha posterior a la denuncia</label>
                </section>
                <button type="button" class="boton boton--primario boton--relacionar" data-relacionar>Relacionar ›</button>
                <section class="tarjeta">
                    <h2>Exclusiones de la póliza</h2>
                    <label class="casilla"><input type="radio" name="exc"> 4.1 Dolo del asegurado</label>
                    <label class="casilla"><input type="radio" name="exc" checked> 4.2 Documentación adulterada</label>
                    <label class="casilla"><input type="radio" name="exc"> 4.5 Hechos no declarados</label>
                </section>
            </div>
            <p class="causal-ok">Causal identificada: cláusula 4.2, expresa y vinculada a 2 evidencias.</p>
            <p class="advertencia">Advertencia: la cláusula 4.5 es ambigua. No se recomienda rechazar con ella.</p>
        </div>
`,
};
