import React, { useState, useEffect } from "react";
import clienteApi from "../services/clienteApi";
import PageContainer from "./PageContainer";
import Modal from "./Modal";
import "./Clientes.css";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editar, setEditar] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    empresa: "",
    direccion: "",
    ciudad: "",
    estado: "",
    pais: "",
    codigo_postal: "",
    estado_cliente: "activo",
  });

  // Cargar clientes al montar
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await clienteApi.listar();
      setClientes(resultado.data || []);
    } catch (err) {
      setError("Error al cargar clientes: " + (err.message || err));
      console.error("Error cargando clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      cargarClientes();
      return;
    }
    try {
      setLoading(true);
      const resultado = await clienteApi.buscar(searchTerm);
      setClientes(resultado.data || []);
    } catch (err) {
      setError("Error en búsqueda: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleNuevo = () => {
    setEditar(false);
    setSelectedCliente(null);
    setFormData({
      nombres: "",
      apellidos: "",
      email: "",
      telefono: "",
      empresa: "",
      direccion: "",
      ciudad: "",
      estado: "",
      pais: "",
      codigo_postal: "",
      estado_cliente: "activo",
    });
    setShowModal(true);
  };

  const handleEditar = (cliente) => {
    setEditar(true);
    setSelectedCliente(cliente);
    setFormData(cliente);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Está seguro que desea eliminar este cliente?")) {
      try {
        await clienteApi.eliminar(id);
        await cargarClientes();
        setError(null);
      } catch (err) {
        setError("Error al eliminar: " + (err.message || err));
      }
    }
  };

  const handleGuardar = async () => {
    try {
      if (!formData.nombres || !formData.apellidos || !formData.email) {
        setError("Nombre, apellido y email son obligatorios");
        return;
      }

      setLoading(true);
      if (editar && selectedCliente) {
        await clienteApi.actualizar(selectedCliente.id, formData);
      } else {
        await clienteApi.crear(formData);
      }
      setShowModal(false);
      await cargarClientes();
      setError(null);
    } catch (err) {
      setError("Error al guardar: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCliente(null);
  };

  return (
    <PageContainer titulo="Gestión de Clientes">
      <div className="clientes-container">
        {/* Búsqueda */}
        <div className="search-section">
          <form onSubmit={handleBuscar}>
            <input
              type="text"
              placeholder="Buscar por nombre, apellido, email o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-search">
              🔍 Buscar
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                cargarClientes();
              }}
              className="btn btn-reset"
            >
              Limpiar
            </button>
          </form>
        </div>

        {/* Botón Nuevo */}
        <button onClick={handleNuevo} className="btn btn-primary">
          ➕ Nuevo Cliente
        </button>

        {/* Mensaje de error */}
        {error && <div className="error-message">{error}</div>}

        {/* Loading */}
        {loading && <div className="loading">Cargando...</div>}

        {/* Tabla de Clientes */}
        {!loading && (
          <div className="clientes-table-wrapper">
            {clientes.length === 0 ? (
              <div className="no-data">No hay clientes registrados</div>
            ) : (
              <table className="clientes-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Empresa</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.id}</td>
                      <td>{cliente.nombres} {cliente.apellidos}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.empresa || "-"}</td>
                      <td>
                        <span className={`badge estado-${cliente.estado_cliente}`}>
                          {cliente.estado_cliente}
                        </span>
                      </td>
                      <td className="acciones">
                        <button
                          onClick={() => handleEditar(cliente)}
                          className="btn btn-small btn-edit"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(cliente.id)}
                          className="btn btn-small btn-delete"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Modal Editar/Crear */}
      <Modal
        mostrar={showModal}
        cerrar={handleCloseModal}
        titulo={editar ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <div className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombres *</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                placeholder="Nombres"
              />
            </div>
            <div className="form-group">
              <label>Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                placeholder="Apellidos"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Teléfono"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Empresa</label>
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleInputChange}
                placeholder="Empresa"
              />
            </div>
            <div className="form-group">
              <label>Estado del Cliente</label>
              <select
                name="estado_cliente"
                value={formData.estado_cliente}
                onChange={handleInputChange}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="suspendido">Suspendido</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Dirección"
              />
            </div>
            <div className="form-group">
              <label>Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                placeholder="Ciudad"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Estado/Provincia</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                placeholder="Estado"
              />
            </div>
            <div className="form-group">
              <label>País</label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
                placeholder="País"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Código Postal</label>
            <input
              type="text"
              name="codigo_postal"
              value={formData.codigo_postal}
              onChange={handleInputChange}
              placeholder="Código Postal"
            />
          </div>

          <div className="modal-buttons">
            <button
              onClick={handleGuardar}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={handleCloseModal} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}

export default Clientes;
