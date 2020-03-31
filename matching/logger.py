import logging

def log():
	logger = logging.getLogger('submatch_matching')
	logger.setLevel(logging.DEBUG)
	fh = logging.FileHandler('submatch_matching.log')
	fh.setLevel(logging.DEBUG)
	formatter = logging.Formatter(fmt='%(asctime)s - %(levelname)s - %(message)s')
	fh.setFormatter(formatter)
	logger.addHandler(fh)
	return logger