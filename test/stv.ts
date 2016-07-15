import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import * as Chai from 'chai';

import getWinners from '../src/stv';

const expect = Chai.expect;

@suite
class STV {
	@test emptyBallotInput() {
		expect(getWinners([])).to.deep.equal([]);
	}
}
