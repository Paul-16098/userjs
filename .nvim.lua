require('overseer').register_template({
	name = "just build (watch)",
	desc = "Auto-saved from task: just build",
	builder = function(_)
		return {
			cmd = { "just", "build" },
			components = { { "on_exit_set_status" }, {
				"on_complete_notify",
				on_change = false,
				statuses = { "FAILURE", "SUCCESS" },
				system = "never"
			}, {
				"on_complete_dispose",
				require_view = { "SUCCESS", "FAILURE" },
				statuses = { "SUCCESS", "FAILURE", "CANCELED" },
				timeout = 300
			}, {
				"restart_on_save",
				delay = 500,
				interrupt = true,
				mode = "autocmd",
				paths = { "." }
			} },
			cwd = ".",
			metadata = {},
			name = "just build (watch)",
			strategy = {
				"jobstart",
				preserve_output = false,
				use_terminal = true
			}
		}
	end,
})
