// Vista: Informe con plantilla editable (wireframe W-16)
import '../../styles/vistas/expediente-informe.css';

export default {
  render: (ctx) => `
        <div class="pagina v-expediente-informe">
            <p class="migas">Reclamos › Decisión e informe</p>
            <div class="encabezado">
                <h1 class="pagina__titulo">Informe del caso RCL-2041</h1>
                <div class="encabezado__botones">
                    <button type="button" class="boton" data-accion>Guardar borrador</button>
                    <button type="button" class="boton" data-accion>Exportar PDF</button>
                    <a class="boton boton--primario" href="#/expediente/RCL-2041/bitacora">Enviar a Legal</a>
                </div>
            </div>
            <div class="informe">
                <section class="tarjeta">
                    <label class="campo"><span>Plantilla</span><select><option>Informe de siniestro estándar</option></select></label>
                    <h2>Estructura</h2>
                    <ol class="estructura">
                        <li>1. Antecedentes</li><li class="activo">2. Hallazgos</li><li>3. Análisis</li><li>4. Conclusión</li>
                    </ol>
                </section>
                <section class="tarjeta editor">
                    <div class="barra-editor"><b>N</b><i>K</i><u>S</u><span>•</span><span>1.</span><span>🖼</span></div>
                    <h2>2. Hallazgos</h2>
                    <p class="texto-editable" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Texto de la sección Hallazgos (editable)" tabindex="0">En primer lugar, el módulo de alertas de inteligencia artificial identificó cuatro inconsistencias documentales, señalando de alta gravedad que la fecha del hecho es posterior a la denuncia y que el monto reclamado excede el valor asegurado, además de registrar facturas con importes repetidos con un pico inusual en el cuarto mes y discrepancias de dirección en dos documentos[3][4]; en segundo lugar, la verificación de identidad confirmó la vigencia oficial del DNI/RUC del titular, pero generó una alerta de control al registrar una coincidencia posible en listas de sancionados (UIF/OFAC) vinculada al Beneficiario 2[5]; por último, la evaluación de antecedentes reveló una red sospechosa de fraude organizado que conecta cinco reclamos por teléfono y domicilio compartidos, identificando un 92 % de similitud con el reclamo previo RCL-1987 (el cual fue rechazado)[6], proporcionando así la evidencia técnica objetiva que justifica la decisión de rechazar el reclamo[8].</p>
                </section>
                <section class="tarjeta">
                    <h2>Datos del caso</h2>
                    <dl class="datos">
                        <dt>Caso</dt><dd>RCL-2041</dd><dt>Asegurado</dt><dd>Nombre</dd><dt>Póliza</dt><dd>000000</dd>
                        <dt>Riesgo</dt><dd>Alto</dd><dt>Decisión</dt><dd>Rechazo</dd>
                    </dl>
                </section>
            </div>
        </div>
`,
};
