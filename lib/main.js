'use babel';

import { IonicBuildProvider } from './build-provider';

module.exports = {
	provideBuilder: function() {
		return IonicBuildProvider;
	}
}
