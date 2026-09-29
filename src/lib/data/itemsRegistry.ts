export type RegistryItem = {
	name: string,
	id: number,
	defX: number,
	defY: number,
	status: boolean
}

export const registryItems: RegistryItem[] = [
	{
		name: "mixer",
		id: 1,
		defX: 3,
		defY: 2,
		status: true
	},
	{
		name: "player",
		id: 2,
		defX: 6,
		defY: 2,
		status: true
	},
	{
		name: "stems",
		id: 3,
		defX: 3,
		defY: 2,
		status: true
	},
	{
		name: "kick",
		id: 4,
		defX: 3,
		defY: 2,
		status: true
	},
	{
		name: "drumset",
		id: 5,
		defX: 3,
		defY: 2,
		status: true
	},
	{
		name: "wavetable",
		id: 6,
		defX: 3,
		defY: 2,
		status: true
	},
	{
		name: "filter",
		id: 7,
		defX: 3,
		defY: 2,
		status: true
	},
	{
		name: "delay",
		id: 8,
		defX: 4,
		defY: 2,
		status: true
	},
	{
		name: "reverb",
		id: 9,
		defX: 4,
		defY: 2,
		status: true
	},
	{
		name: "modulator",
		id: 10,
		defX: 4,
		defY: 2,
		status: true
	},
	{
		name: "sequencer",
		id: 11,
		defX: 4,
		defY: 2,
		status: true
	}
]