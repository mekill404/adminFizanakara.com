package mg.fizanakara.api.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class KeepAliveRepository {

    private final JdbcTemplate jdbcTemplate;

    public KeepAliveRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void pingDatabase() {
        jdbcTemplate.queryForObject("SELECT 1", Integer.class);
    }
}