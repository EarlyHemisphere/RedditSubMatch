import logging

def log(name):
	logger = logging.getLogger(name)
	logger.setLevel(logging.DEBUG)
	fh = logging.FileHandler('submatch_matching.log')
	fh.setLevel(logging.DEBUG)
	formatter = logging.Formatter(fmt='%(asctime)s - %(levelname)s - %(name)s - %(message)s')
	fh.setFormatter(formatter)
	logger.addHandler(fh)
	return logger