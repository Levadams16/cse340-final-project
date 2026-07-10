// Add these two functions to src/models/inventory/vehicles.js
// Place them before the export block at the bottom of the file

const addVehicleImages = async (vehicleId, urls) => {
    // Mark the first URL as the primary image
    const values = urls.map((url, index) => `(${vehicleId}, '${url.replace(/'/g, "''")}', ${index === 0})`).join(', ');
    const query = `
        INSERT INTO vehicle_images (vehicle_id, image_url, is_primary)
        VALUES ${values}
        RETURNING *
    `;
    const result = await db.query(query);
    return result.rows;
};

const deleteVehicleImages = async (vehicleId) => {
    const query = `DELETE FROM vehicle_images WHERE vehicle_id = $1`;
    await db.query(query, [vehicleId]);
};

// Also add addVehicleImages and deleteVehicleImages to your export block:
// export {
//     getAllVehicles,
//     getAllVehiclesAdmin,
//     getVehiclesByCategory,
//     getVehicleById,
//     getVehicleImages,
//     getAllCategories,
//     createVehicle,
//     updateVehicle,
//     deleteVehicle,
//     addVehicleImages,      <-- add this
//     deleteVehicleImages    <-- add this
// };
