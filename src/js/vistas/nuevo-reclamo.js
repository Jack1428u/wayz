// Vista: Registrar reclamo (wireframe W-07). Formulario con validación accesible; ver comportamientos/nuevo-reclamo.js
import '../../styles/vistas/nuevo-reclamo.css';
import '../../styles/vistas/nuevo-reclamo-extra.css';

export default {
  render: () => `
    <div class="pagina v-nuevo-reclamo">
      <p class="migas"><a href="#/reclamos">Reclamos</a> › Bandeja › Nuevo</p>
      <h1 class="pagina__titulo">Registrar reclamo</h1>
      <p class="ayuda">Los campos marcados con * son obligatorios.</p>

      <form class="formulario" id="f-reclamo" data-propio novalidate>
        <section class="tarjeta" aria-labelledby="h-reclamante">
          <h2 id="h-reclamante">1. Datos del reclamante</h2>
          <div class="fila">
            <label class="campo campo--corto"><span>Documento *</span>
              <select name="tipoDoc"><option>DNI</option><option>RUC</option><option>CE</option></select></label>
            <label class="campo"><span>N.º de documento *</span>
              <input type="text" name="numero" inputmode="numeric" placeholder="7XXXXXXX" required pattern="\\d{8,11}"
                     title="Solo números: 8 dígitos para DNI o 11 para RUC" data-mensaje="Escribe el número de documento solo con dígitos (8 para DNI, 11 para RUC)."></label>
            <button type="button" class="boton boton--verificar" id="verificar">Verificar</button>
          </div>
          <p class="verificado" id="verificado" role="status" hidden></p>
          <label class="campo"><span>Nombre completo *</span>
            <input type="text" name="nombre" placeholder="Nombre del reclamante" autocomplete="name" required></label>
          <div class="fila">
            <label class="campo"><span>Correo electrónico *</span>
              <input type="email" name="correo" placeholder="correo@ejemplo.com" autocomplete="email" required
                     data-mensaje="Escribe un correo válido, por ejemplo ana@ejemplo.com."></label>
            <label class="campo campo--corto"><span>Teléfono *</span>
              <input type="tel" name="telefono" placeholder="9XXXXXXXX" autocomplete="tel" required pattern="9\\d{8}"
                     title="9 dígitos, empezando con 9" data-mensaje="Escribe un teléfono de 9 dígitos que empiece con 9."></label>
          </div>
        </section>

        <section class="tarjeta" aria-labelledby="h-siniestro">
          <h2 id="h-siniestro">2. Datos del siniestro</h2>
          <div class="fila">
            <label class="campo"><span>Tipo de siniestro *</span>
              <select name="tipo" required data-mensaje="Elige el tipo de siniestro.">
                <option value="">Seleccionar</option><option>Vehicular</option><option>Salud</option><option>Hogar</option><option>Vida</option></select></label>
            <label class="campo"><span>Fecha del hecho *</span><input type="date" name="fecha" required data-mensaje="Indica la fecha en que ocurrió el hecho."></label>
          </div>
          <div class="fila">
            <label class="campo"><span>Monto estimado (S/) *</span>
              <input type="text" name="monto" inputmode="decimal" placeholder="0.00" required pattern="\\d+(\\.\\d{1,2})?"
                     title="Número con hasta 2 decimales" data-mensaje="Escribe el monto solo con números, por ejemplo 1500 o 1500.50."></label>
            <label class="campo"><span>Póliza *</span>
              <input type="text" name="poliza" placeholder="PL-000000" required pattern="PL-\\d{6}"
                     title="Formato PL- seguido de 6 dígitos" data-mensaje="El número de póliza tiene el formato PL-000000."></label>
          </div>
          <label class="campo"><span>Descripción *</span>
            <textarea name="descripcion" required minlength="10" data-mensaje="Describe lo ocurrido con al menos 10 caracteres."></textarea></label>
        </section>

        <section class="tarjeta adjuntos" aria-labelledby="h-adjuntos">
          <h2 id="h-adjuntos">3. Adjuntos</h2>
          <div class="adjuntos__cuerpo">
            <label class="zona-carga" id="zona">Arrastra archivos aquí o selecciona
              <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.zip,.txt" class="solo-lectores" id="archivos"></label>
            <ul class="lista-carga" id="lista-carga" aria-live="polite"></ul>
          </div>
        </section>

        <div class="acciones">
          <a class="boton" href="#/reclamos">Cancelar</a>
          <button type="submit" class="boton boton--primario">Guardar reclamo</button>
        </div>
      </form>
    </div>`,
};
