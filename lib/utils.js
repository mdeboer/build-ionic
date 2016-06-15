'use babel';

export async function getPlatforms(dir) {
	return new Promise((resolve, reject) => {
		fs.readdir(path.join(dir, 'platforms'), (err, files) => {
			if(err) {
				reject(err);
			}

			// Get platforms
			let platforms = [];
			for(let i = 0; i < files.length; i++) {
				try {
					fs.accessSync(path.join(dir, 'platforms', files[i], files[i]+'.json'));
					platforms.push(files[i]);
				} catch(err) {
				}
			}

			resolve(platforms);
		});
	});
}

export function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}
