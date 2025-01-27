import 'module-alias/register';

import App from '@/infra/server/App';
import { controllers } from './modules';

const app = new App(controllers);

app.start();
