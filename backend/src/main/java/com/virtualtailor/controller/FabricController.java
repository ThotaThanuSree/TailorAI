package com.virtualtailor.controller;

import com.virtualtailor.dto.ApiResponse;
import com.virtualtailor.model.Fabric;
import com.virtualtailor.service.FabricService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fabrics")
public class FabricController {

    @Autowired
    private FabricService fabricService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Fabric>>> getAllFabrics() {
        List<Fabric> fabrics = fabricService.getAllFabrics();
        return ResponseEntity.ok(ApiResponse.success("Fabrics fetched successfully!", fabrics));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Fabric>> getFabricById(@PathVariable Long id) {
        Fabric fabric = fabricService.getFabricById(id);
        return ResponseEntity.ok(ApiResponse.success("Fabric details retrieved!", fabric));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Fabric>> createFabric(@RequestBody Fabric fabric) {
        Fabric savedFabric = fabricService.createFabric(fabric);
        return ResponseEntity.ok(ApiResponse.success("Fabric created successfully!", savedFabric));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Fabric>> updateFabric(@PathVariable Long id, @RequestBody Fabric fabricDetails) {
        Fabric updatedFabric = fabricService.updateFabric(id, fabricDetails);
        return ResponseEntity.ok(ApiResponse.success("Fabric updated successfully!", updatedFabric));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteFabric(@PathVariable Long id) {
        fabricService.deleteFabric(id);
        return ResponseEntity.ok(ApiResponse.success("Fabric deleted successfully!", "Fabric with ID " + id + " has been deleted."));
    }
}
