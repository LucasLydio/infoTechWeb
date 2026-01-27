# infoTechWeb

infoTechWeb is a modern, responsive web application for online discussions, built with Angular. It provides a clean, minimalist interface for users to create topics, post replies, send messages, and interact in a tech-focused community.

## Features

- User authentication (login/register)
- Create, view, and reply to topics
- Messaging system (inbox, send)
- News and announcements
- User profiles and avatars
- Responsive design (mobile & desktop)
- Modular architecture for easy feature expansion
- Theming support (light/dark)

## Technologies Used

- Angular 18+
- TypeScript
- SCSS (glassmorphism & minimalist styles)
- RxJS
- Angular Router
- RESTful API integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/forum-frontend.git
cd forum-frontend
npm install
```

### Development Server

Start the development server:

```bash
ng serve
```

Navigate to [http://localhost:4200](http://localhost:4200). The app will reload automatically on code changes.

### Build

To build the project for production:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

### Testing

Run unit tests:

```bash
ng test
```

Run end-to-end tests:

```bash
ng e2e
```

## Project Structure

```
src/
	app/
		core/         # Core modules, guards, interceptors, services
		features/     # Feature modules (auth, menu, messages, news, profile, replies, topics)
		shared/       # Shared components and models
	assets/         # Images and other assets
	environments/   # Environment configs
	theme/          # SCSS theme files
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and new features.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Angular CLI](https://angular.dev/tools/cli)
- [Karma](https://karma-runner.github.io)
- [RxJS](https://rxjs.dev)
