# Requirements Document

## Introduction

Fix the Coolify deployment failure caused by Rollup's missing native module `@rollup/rollup-linux-x64-gnu` during the build process. The deployment is failing at the build step when running `npm run build --workspace @mawu/web`, preventing the application from being deployed to production on Coolify using nixpacks.

## Requirements

### Requirement 1: Rollup Build Process Fix

**User Story:** As a developer, I want the build process to complete successfully in the Coolify deployment environment, so that the application can be deployed to production without build failures.

#### Acceptance Criteria

1. WHEN the nixpacks build runs THEN the system SHALL successfully install all required Rollup native dependencies
2. WHEN `npm run build --workspace @mawu/web` executes THEN the system SHALL complete without MODULE_NOT_FOUND errors
3. WHEN Rollup processes the build THEN the system SHALL have access to the correct platform-specific native modules
4. WHEN the build completes THEN the system SHALL generate the production-ready static files in `apps/web/dist/`
5. IF native modules are missing THEN the system SHALL use alternative installation methods or configurations

### Requirement 2: Nixpacks Configuration Optimization

**User Story:** As a DevOps engineer, I want the nixpacks configuration to handle npm dependency installation correctly, so that optional dependencies don't cause build failures.

#### Acceptance Criteria

1. WHEN nixpacks installs dependencies THEN the system SHALL handle optional dependencies appropriately for the Linux x64 environment
2. WHEN the install phase runs THEN the system SHALL ensure platform-specific native modules are available
3. WHEN dependencies are cached THEN the system SHALL maintain cache integrity for subsequent builds
4. WHEN the build environment is prepared THEN the system SHALL have all necessary build tools and libraries
5. IF dependency conflicts occur THEN the system SHALL resolve them automatically or provide clear error handling

### Requirement 3: Build Environment Compatibility

**User Story:** As a deployment engineer, I want the build process to be compatible with the Coolify/nixpacks Linux environment, so that deployments are reliable and consistent.

#### Acceptance Criteria

1. WHEN building in the Linux container THEN the system SHALL use the correct architecture-specific dependencies
2. WHEN Node.js modules are compiled THEN the system SHALL target the correct platform (linux-x64-gnu)
3. WHEN the build process runs THEN the system SHALL not depend on platform-specific modules that aren't available
4. WHEN alternative solutions are needed THEN the system SHALL implement workarounds that maintain functionality
5. WHEN the deployment completes THEN the system SHALL serve the application correctly from the built assets

### Requirement 4: Deployment Process Validation

**User Story:** As a project maintainer, I want to verify that the deployment fix works consistently, so that future deployments don't encounter the same issue.

#### Acceptance Criteria

1. WHEN the fix is implemented THEN the system SHALL complete the full Coolify deployment process successfully
2. WHEN the application is deployed THEN the system SHALL serve the frontend application correctly
3. WHEN testing the deployment THEN the system SHALL demonstrate that all build steps complete without errors
4. WHEN validating the fix THEN the system SHALL ensure no functionality is lost due to the build process changes
5. WHEN documenting the solution THEN the system SHALL provide clear guidance for future deployments