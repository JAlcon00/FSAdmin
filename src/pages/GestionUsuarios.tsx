// import React from 'react';
// import TablaUsuarios from '../components/Usuarios/TablaUsuarios/TablaUsuarios';
// import FormUsuario from '../components/Usuarios/FormUsuario/FormUsuario';

// const GestionUsuarios: React.FC = () => {
//   const [modo, setModo] = React.useState<'lista' | 'crear' | 'editar'>('lista');
//   const [usuarioEditar, setUsuarioEditar] = React.useState<string | null>(null);

//   const handleCrear = () => {
//     setUsuarioEditar(null);
//     setModo('crear');
//   };

//   const handleEditar = (id: string) => {
//     setUsuarioEditar(id);
//     setModo('editar');
//   };

//   const handleVolver = () => {
//     setModo('lista');
//     setUsuarioEditar(null);
//   };

//   return (
//     <div>
//       <h1>Gestión de Usuarios</h1>
//       {modo === 'lista' && (
//         <>
//           <button onClick={handleCrear} className="btn btn-primary mb-3">Crear usuario</button>
//           <TablaUsuarios onEditar={handleEditar} />
//         </>
//       )}
//       {(modo === 'crear' || modo === 'editar') && (
//         <FormUsuario usuarioId={usuarioEditar} onVolver={handleVolver} />
//       )}
//     </div>
//   );
// };

// export default GestionUsuarios;
