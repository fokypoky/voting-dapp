const votingApp = artifacts.require('VotingApp');
module.exports = (deployer) => {
	deployer.deploy(votingApp);
}