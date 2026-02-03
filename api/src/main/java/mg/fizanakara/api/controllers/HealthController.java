package mg.fizanakara.api.controllers;

import mg.fizanakara.api.repository.KeepAliveRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController("/api")
public class HealthController {

    private final KeepAliveRepository keepAliveRepository;

    public HealthController(KeepAliveRepository keepAliveRepository) {
        this.keepAliveRepository = keepAliveRepository;
    }

    @GetMapping("/keep-alive")
    public String keepAlive() {
        keepAliveRepository.pingDatabase();
        return "Ping OK - " + LocalDateTime.now();
    }

    @GetMapping("/health")
    public String health() {
        return "UP - " + LocalDateTime.now();
    }
}