const getEnvironment = () => {
  switch (process.env.REACT_APP_PROJECT_ENV) {
    case 'production':
      return 'production';
    case 'development':
      return 'development';
    default:
      return '';
  }
};

const getBaseUrl = () => {
  switch (process.env.REACT_APP_PROJECT_ENV) {
    case 'production':
      return 'https://school-administration.vercel.app/';
    case 'development':
      return 'http://localhost:3000/';
    default:
      return 'http://localhost:3000/';
  }
};

const Url = {
  baseUrl: getBaseUrl(),
};

const config = {
  BASE_URL: `${Url.baseUrl}`,
  environment: getEnvironment(),
  getBaseUrl: getBaseUrl(),
};

export default config;
