# Encryption in PostgreSQL

Protecting your data at rest and in transit.

## 1. Data in Transit (TLS/SSL)
- Always use SSL for client-server communication.
- Configure `ssl = on` in `postgresql.conf` and `hostssl` in `pg_hba.conf`.

## 2. Data at Rest (TDE)
- Core Postgres does **not** have built-in Transparent Data Encryption.
- Solutions:
    - **Disk/Volume Encryption**: Use LUKS (Linux) or AWS EBS Encryption.
    - **PGP Encryption**: Use the `pgcrypto` extension to encrypt specific columns.
```sql
SELECT pgp_sym_encrypt('sensitive data', 'mykey');
```

## 3. Always Encrypted (Client-Side)
- The database never sees the plaintext data. Encryption happens in the application layer.

## Senior Consideration
- **Key Management**: Where do you store the encryption keys? (Use a KMS or HashiCorp Vault).
- **Performance**: Column-level encryption via `pgcrypto` prevents indexing on those columns (unless you use deterministic encryption/blind indexes).
- **Compliance**: Understanding GDPR/PCI-DSS requirements for data protection.

