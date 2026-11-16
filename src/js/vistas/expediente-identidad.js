// Vista: Expediente – Identidad y listas de control (wireframe W-11)
import { expedienteHeader } from '../componentes/expediente.js';
import '../../styles/vistas/expediente-identidad.css';

export default {
  render: (ctx) => `
        <div class="pagina v-expediente-identidad">
${expedienteHeader('Identidad y listas', ctx)}
            <div class="identidad">
                <section class="tarjeta">
                    <h2>Verificación de identidad</h2>
                    <dl class="datos">
                        <dt>Documento</dt><dd>DNI 7XXXXXXX</dd>
                        <dt>Nombre oficial</dt><dd>Coincide</dd>
                        <dt>Estado</dt><dd>Vigente</dd>
                    </dl>
                    <p><span class="etiqueta etiqueta--gris">Identidad confirmada</span></p>
                    <button type="button" class="boton" data-accion>Volver a consultar</button>
                </section>
                <div>
                    <section class="tarjeta">
                        <h2>Cruce con listas de sancionados y lavado de activos</h2>
                        <table class="tabla">
                            <thead><tr><th>Persona</th><th>Rol</th><th>Lista consultada</th><th>Resultado</th></tr></thead>
                            <tbody>
                                <tr><td>Reclamante</td><td>Titular</td><td>UIF · OFAC</td><td>Sin coincidencia</td></tr>
                                <tr><td>Beneficiario 1</td><td>Cónyuge</td><td>UIF · OFAC</td><td>Sin coincidencia</td></tr>
                                <tr class="seleccionada"><td>Beneficiario 2</td><td>Tercero</td><td>UIF · OFAC</td><td>Coincidencia posible</td></tr>
                            </tbody>
                        </table>
                    </section>
                    <p class="aviso-punteado">Coincidencia posible con Beneficiario 2. Revisar antes de continuar.</p>
                    <button type="button" class="boton boton--derecha" data-dialog="escalar">Escalar caso</button>
                </div>
            </div>
            <section class="tarjeta">
                <h2>Fuentes consultadas</h2>
                <p class="resumen">Servicio oficial de identidad · Listas de personas expuestas y sancionadas. Última consulta: dd/mm/aaaa hh:mm.</p>
            </section>
        </div>
`,
};
