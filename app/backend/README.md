# Multi-role account foundation

This directory documents the private PocketBase backend expected by the public workspace. PocketBase must run on an HTTPS server with persistent storage; it cannot run inside GitHub Pages.

## Collections

### users (auth collection)
Fields: name (text), email (built-in identity), verified (built-in), platform_roles (multiple select: bpc_admin, bpc_employee).

### organizations
Fields: name, slug, status, subscription_tier, created_by (relation to users).

### memberships
Fields:
- user: relation to users
- organization: relation to organizations
- roles: multiple select (owner, administrator, manager, supervisor, employee, stakeholder, customer, researcher, participant)
- permissions: multiple select (manage_members, manage_training, assign_feedback, submit_feedback, view_aggregate_reports, view_identifiable_reports, manage_projects, export_data)
- status: active, invited, suspended
- invited_by: relation to users
- expires_at: optional date

A user may have several roles in one membership and different roles in different organizations.

### projects
Fields: organization, name, project_type (training, onboarding, feedback_360, customer_feedback, research, analytics), status, starts_at, ends_at.

### project_participants
Fields: project, user, membership, roles, permissions, status.

### feedback_assignments
Fields: project, subject_user, respondent_user (optional), respondent_email (optional), relationship (self, employee, supervisor, peer, management, stakeholder, customer), invitation_token_hash, expires_at, completed_at.

External customers and stakeholders can use expiring invitations without receiving full organization access.

### responses
Fields: project, assignment, respondent_user (optional), instrument_version, encrypted_payload/reference, submitted_at. Collection rules must prevent participants from listing other respondents' records.

### report_access
Fields: project, user, report_scope (individual, team, organization, aggregate_only), expires_at.

## Required security rules

1. Deny all collection access by default.
2. Permit users to read only their own user record.
3. Permit membership reads only when user = @request.auth.id.
4. Permit project access only through active membership or project_participants.
5. Never expose raw response records to supervisors or customers; reports should use server-generated aggregates.
6. Reserve identifiable reports for explicit permission and documented client authorization.
7. Require HTTPS, verified email, rate limiting, backups, and MFA for platform administrators.
8. Keep PocketBase superuser credentials and SMTP credentials outside the GitHub repository.

## Front-end connection

Copy config.example.js to config.js, set pocketBaseUrl to the HTTPS backend URL, and retain an empty value until the backend is available. No secret belongs in config.js.
