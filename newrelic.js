/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */

exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['ebital'],
  license_key: 'b62b3575127458928c94a2ae59f4ce5925b4NRAL',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info',
  },
  error_collector: {
    enabled: true,
  },
};
