package com.virtualtailor.service;

import com.virtualtailor.exception.ResourceNotFoundException;
import com.virtualtailor.model.Fabric;
import com.virtualtailor.repository.FabricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FabricService {

    @Autowired
    private FabricRepository fabricRepository;

    public List<Fabric> getAllFabrics() {
        return fabricRepository.findAll();
    }

    public Fabric getFabricById(Long id) {
        return fabricRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fabric not found with id: " + id));
    }

    public Fabric createFabric(Fabric fabric) {
        return fabricRepository.save(fabric);
    }

    public Fabric updateFabric(Long id, Fabric fabricDetails) {
        Fabric fabric = getFabricById(id);
        fabric.setFabricName(fabricDetails.getFabricName());
        fabric.setWeatherType(fabricDetails.getWeatherType());
        fabric.setOccasionType(fabricDetails.getOccasionType());
        fabric.setComfortLevel(fabricDetails.getComfortLevel());
        fabric.setDescription(fabricDetails.getDescription());
        return fabricRepository.save(fabric);
    }

    public void deleteFabric(Long id) {
        Fabric fabric = getFabricById(id);
        fabricRepository.delete(fabric);
    }
}
