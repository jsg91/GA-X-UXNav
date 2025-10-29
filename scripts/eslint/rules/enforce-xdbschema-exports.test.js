/**
 * @fileoverview Tests for enforce-xdbschema-exports rule
 */

'use strict';

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./enforce-xdbschema-exports')['enforce-xdbschema-exports'];

const ruleTester = createRuleTester();

ruleTester.run('enforce-xdbschema-exports', rule, {
  valid: [
    {
      // Valid XDBSchema file with all required exports
      code: `
        export const {
          schemaDefinition: aircraftsSchemaDefinition,
          migrationMetadata: aircraftsMigrationMetadata,
          getSchemaExports: getAircraftsSchemaExports,
          schema: aircraftsSchema,
          service: aircraftsService,
          hooks: aircraftsHooks,
          types: {
            Entity: Aircraft,
            EntityInsert: AircraftInsert,
            EntityUpdate: AircraftUpdate
          },
        } = defineAndExportXDBSchema('Aircraft', { tableName: 'aircrafts' });
      `,
      filename: 'aircrafts.xdbschema.ts',
    },
    {
      // Valid XDBSchema file with formConfig
      code: `
        export const {
          schemaDefinition: eventsSchemaDefinition,
          migrationMetadata: eventsMigrationMetadata,
          getSchemaExports: getEventsSchemaExports,
          schema: eventsSchema,
          service: eventsService,
          hooks: eventsHooks,
          formConfig: eventsFormConfig,
          types: {
            Entity: Event,
            EntityInsert: EventInsert,
            EntityUpdate: EventUpdate
          },
        } = defineAndExportXDBSchema('Event', { tableName: 'events' }, { includeFormConfig: true });
      `,
      filename: 'events.xdbschema.ts',
    },
    {
      // Non-xdbschema file should be ignored
      code: `
        export const something = 'anything';
      `,
      filename: 'regular.ts',
    },
  ],

  invalid: [
    {
      // Multiple export statements
      code: `
        export const {
          schemaDefinition: aircraftsSchemaDefinition,
          migrationMetadata: aircraftsMigrationMetadata,
          getSchemaExports: getAircraftsSchemaExports,
          schema: aircraftsSchema,
          service: aircraftsService,
          hooks: aircraftsHooks,
          types: {
            Entity: Aircraft,
            EntityInsert: AircraftInsert,
            EntityUpdate: AircraftUpdate
          },
        } = defineAndExportXDBSchema('Aircraft', { tableName: 'aircrafts' });

        export const extraExport = 'not allowed';
      `,
      filename: 'aircrafts.xdbschema.ts',
      errors: [{ messageId: 'multipleExports' }],
    },
    {
      // Not a destructuring export
      code: `
        export const aircraftsSchema = defineAndExportXDBSchema('Aircraft', { tableName: 'aircrafts' });
      `,
      filename: 'aircrafts.xdbschema.ts',
      errors: [{ messageId: 'notDestructuringExport' }],
    },
    {
      // Wrong function name
      code: `
        export const {
          schemaDefinition: aircraftsSchemaDefinition,
          migrationMetadata: aircraftsMigrationMetadata,
          getSchemaExports: getAircraftsSchemaExports,
          schema: aircraftsSchema,
          service: aircraftsService,
          hooks: aircraftsHooks,
          types: {
            Entity: Aircraft,
            EntityInsert: AircraftInsert,
            EntityUpdate: AircraftUpdate
          },
        } = defineXDBSchema({ tableName: 'aircrafts' });
      `,
      filename: 'aircrafts.xdbschema.ts',
      errors: [{ messageId: 'notDestructuringExport' }],
    },
    {
      // Missing schemaDefinition
      code: `
        export const {
          migrationMetadata: aircraftsMigrationMetadata,
          getSchemaExports: getAircraftsSchemaExports,
          schema: aircraftsSchema,
          service: aircraftsService,
          hooks: aircraftsHooks,
          types: {
            Entity: Aircraft,
            EntityInsert: AircraftInsert,
            EntityUpdate: AircraftUpdate
          },
        } = defineAndExportXDBSchema('Aircraft', { tableName: 'aircrafts' });
      `,
      filename: 'aircrafts.xdbschema.ts',
      errors: [{ messageId: 'missingRequiredProperty', data: { property: 'schemaDefinition' } }],
    },
    {
      // Missing migrationMetadata
      code: `
        export const {
          schemaDefinition: aircraftsSchemaDefinition,
          getSchemaExports: getAircraftsSchemaExports,
          schema: aircraftsSchema,
          service: aircraftsService,
          hooks: aircraftsHooks,
          types: {
            Entity: Aircraft,
            EntityInsert: AircraftInsert,
            EntityUpdate: AircraftUpdate
          },
        } = defineAndExportXDBSchema('Aircraft', { tableName: 'aircrafts' });
      `,
      filename: 'aircrafts.xdbschema.ts',
      errors: [{ messageId: 'missingRequiredProperty', data: { property: 'migrationMetadata' } }],
    },
    {
      // Missing getSchemaExports
      code: `
        export const {
          schemaDefinition: aircraftsSchemaDefinition,
          migrationMetadata: aircraftsMigrationMetadata,
          schema: aircraftsSchema,
          service: aircraftsService,
          hooks: aircraftsHooks,
          types: {
            Entity: Aircraft,
            EntityInsert: AircraftInsert,
            EntityUpdate: AircraftUpdate
          },
        } = defineAndExportXDBSchema('Aircraft', { tableName: 'aircrafts' });
      `,
      filename: 'aircrafts.xdbschema.ts',
      errors: [{ messageId: 'missingRequiredProperty', data: { property: 'getSchemaExports' } }],
    },
    {
      // Missing schema
      code: `
        export const {
          schemaDefinition: aircraftsSchemaDefinition,
          migrationMetadata: aircraftsMigrationMetadata,
          getSchemaExports: getAircraftsSchemaExports,
          service: aircraftsService,
          hooks: aircraftsHooks,
          types: {
            Entity: Aircraft,
            EntityInsert: AircraftInsert,
            EntityUpdate: AircraftUpdate
          },
        } = defineAndExportXDBSchema('Aircraft', { tableName: 'aircrafts' });
      `,
      filename: 'aircrafts.xdbschema.ts',
      errors: [{ messageId: 'missingRequiredProperty', data: { property: 'schema' } }],
    },
    {
      // Missing service
      code: `
        export const {
          schemaDefinition: aircraftsSchemaDefinition,
          migrationMetadata: aircraftsMigrationMetadata,
          getSchemaExports: getAircraftsSchemaExports,
          schema: aircraftsSchema,
          hooks: aircraftsHooks,
          types: {
            Entity: Aircraft,
            EntityInsert: AircraftInsert,
            EntityUpdate: AircraftUpdate
          },
        } = defineAndExportXDBSchema('Aircraft', { tableName: 'aircrafts' });
      `,
      filename: 'aircrafts.xdbschema.ts',
      errors: [{ messageId: 'missingRequiredProperty', data: { property: 'service' } }],
    },
    {
      // Missing hooks
      code: `
        export const {
          schemaDefinition: aircraftsSchemaDefinition,
          migrationMetadata: aircraftsMigrationMetadata,
          getSchemaExports: getAircraftsSchemaExports,
          schema: aircraftsSchema,
          service: aircraftsService,
          types: {
            Entity: Aircraft,
            EntityInsert: AircraftInsert,
            EntityUpdate: AircraftUpdate
          },
        } = defineAndExportXDBSchema('Aircraft', { tableName: 'aircrafts' });
      `,
      filename: 'aircrafts.xdbschema.ts',
      errors: [{ messageId: 'missingRequiredProperty', data: { property: 'hooks' } }],
    },
    {
      // Missing Entity type
      code: `
        export const {
          schemaDefinition: aircraftsSchemaDefinition,
          migrationMetadata: aircraftsMigrationMetadata,
          getSchemaExports: getAircraftsSchemaExports,
          schema: aircraftsSchema,
          service: aircraftsService,
          hooks: aircraftsHooks,
          types: {
            EntityInsert: AircraftInsert,
            EntityUpdate: AircraftUpdate
          },
        } = defineAndExportXDBSchema('Aircraft', { tableName: 'aircrafts' });
      `,
      filename: 'aircrafts.xdbschema.ts',
      errors: [{ messageId: 'missingRequiredType', data: { type: 'Entity' } }],
    },
    {
      // Missing EntityInsert type
      code: `
        export const {
          schemaDefinition: aircraftsSchemaDefinition,
          migrationMetadata: aircraftsMigrationMetadata,
          getSchemaExports: getAircraftsSchemaExports,
          schema: aircraftsSchema,
          service: aircraftsService,
          hooks: aircraftsHooks,
          types: {
            Entity: Aircraft,
            EntityUpdate: AircraftUpdate
          },
        } = defineAndExportXDBSchema('Aircraft', { tableName: 'aircrafts' });
      `,
      filename: 'aircrafts.xdbschema.ts',
      errors: [{ messageId: 'missingRequiredType', data: { type: 'EntityInsert' } }],
    },
    {
      // Missing EntityUpdate type
      code: `
        export const {
          schemaDefinition: aircraftsSchemaDefinition,
          migrationMetadata: aircraftsMigrationMetadata,
          getSchemaExports: getAircraftsSchemaExports,
          schema: aircraftsSchema,
          service: aircraftsService,
          hooks: aircraftsHooks,
          types: {
            Entity: Aircraft,
            EntityInsert: AircraftInsert
          },
        } = defineAndExportXDBSchema('Aircraft', { tableName: 'aircrafts' });
      `,
      filename: 'aircrafts.xdbschema.ts',
      errors: [{ messageId: 'missingRequiredType', data: { type: 'EntityUpdate' } }],
    },
  ],
});

console.log('✅ All enforce-xdbschema-exports tests passed');
