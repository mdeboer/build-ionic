'use babel';

import fs from 'fs';
import path from 'path';
import Promise from 'promise';
import { clone, getPlatforms } from './utils';

export class IonicBuildProvider {

	constructor(cwd) {
		this.cwd = cwd;
		this.title = 'Ionic';
		this.targetNamePrefix = this.title + ': ';

		this.targetsBaseSettings = [
			{
				name: 'Serve',
				args: ['serve']
			},
			{
				name: 'Run',
				args: ['run']
			},
			{
				name: 'Emulate',
				args: ['emulate']
			},
			{
				name: 'Build',
				args: ['build']
			}
		];
	}

	getNiceName() {
		return this.title;
	}

	isEligible() {
		try {
			fs.accessSync(path.join(this.cwd, 'ionic.project'));
			fs.accessSync(path.join(this.cwd, 'platforms'));

			return true;
		} catch(err) {
			return false;
		}
	}

	settings() {

		return new Promise((resolve, reject) => {
			const that = this;

			// Get platforms
			const platforms = getPlatforms(this.cwd);

			platforms.then((results) => {

				// Loop through platforms
				for(let i = 0; i < results.length; i++) {

					// Add platform specific targets
					that.targetsBaseSettings.push(
						{
							name: 'Run (' + results[i] + ')',
							args: ['run', results[i]]
						},
						{
							name: 'Emulate (' + results[i] + ')',
							args: ['emulate', results[i]]
						},
						{
							name: 'Build (' + results[i] + ')',
							args: ['build', results[i]]
						}
					);
				}

				// Add default options for targets and sort by name
				const settings = that.prepareSettings(that.targetsBaseSettings).sort((a,b) => {
					if(a.name < b.name) {
						return -1;
					}
					if(a.name > b.name) {
						return 1;
					}
					return 0;
				});

				// Return targets
				resolve(settings);
			});
		});
	}

	prepareSettings(settings) {
		return settings.map(base => {
			const item = clone(base);

			item.name = this.targetNamePrefix + base.name;
			item.exec = 'ionic';
			item.sh = false;
			item.env = Object.create(process.env);
			item.errorMatch = [
				'(?<file>[\\/0-9a-zA-Z\\._]+):(?<line>\\d+):(?<col>\\d+):\\s+(?<message>.+)'
			];
			item.atomCommandName = `ionic:target:${base.name.toLowerCase()}-${this.cwd}`;

			return item;
		});
	}

}
