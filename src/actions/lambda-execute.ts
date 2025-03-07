import { streamDeck, action, KeyDownEvent, SingletonAction, WillAppearEvent, WillDisappearEvent, DidReceiveSettingsEvent, KeyAction } from "@elgato/streamdeck";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { ExecuteLambda, ExecuteLambdaOutput } from "../lib/lambda";

/**
 * An action class that 
 */
@action({ UUID: "com.pthomison.aws-utilities.lambda-executer" })
export class LambdaExecuterAction extends SingletonAction<LambdaExecuterSettings> {

	override async onWillAppear(ev: WillAppearEvent<LambdaExecuterSettings>): Promise<void> {
		this.ready(ev, `${ev.payload.settings.functionShortName}`);
	}

	override async onKeyDown(ev: KeyDownEvent<LambdaExecuterSettings>): Promise<void> {
		try {
			const { settings } = ev.payload;
			if (settings.functionName == undefined) {
				return
			}

			let awsRegion = settings.awsRegion ?? "us-east-1"
			let awsProfile = settings.awsProfile ?? "default"
			let functionData = settings.functionData ?? "{}"

			let client = new LambdaClient({ region: awsRegion, profile: awsProfile });
			let lambdaPromise = ExecuteLambda(client, settings.functionName, JSON.parse(functionData));
			await this.running(ev, `${ev.payload.settings.runningMessage}`);
			let out = await lambdaPromise;

			if (out.Succeeded) {
				this.success(ev, `${ev.payload.settings.successMessage}`)
			} else {
				await this.error(ev, `${ev.payload.settings.failureMessage}`);
			}
		} catch (error) {
			await this.error(ev, String(error))
		}
	}

	async onTick(event: WillAppearEvent): Promise<void> {

	}

	async ready(event: WillAppearEvent | KeyDownEvent, readyMsg: string): Promise<void> {
		await event.action.setTitle(readyMsg);
		await this.paint(event.action as KeyAction, "ready");
	}

	async running(event: WillAppearEvent | KeyDownEvent, runningMsg: string): Promise<void> {
		await event.action.setTitle(runningMsg);
		await this.paint(event.action as KeyAction, "running");
	}

	async success(event: WillAppearEvent | KeyDownEvent, successMsg: string): Promise<void> {
		await this.paint(event.action as KeyAction, "success");
		await event.action.setTitle(successMsg);
		setTimeout(async () => {
			await this.ready(event, `${event.payload.settings.functionShortName}`)
		}, 2000)
	}

	async error(event: WillAppearEvent | KeyDownEvent, errorMsg: string): Promise<void> {
		streamDeck.logger.error("Error: ", errorMsg)

		await this.paint(event.action as KeyAction, "failure");
		await event.action.setTitle(errorMsg);

		setTimeout(async () => {
			await this.ready(event, `${event.payload.settings.functionShortName}`)
		}, 2000)
	}

	async paint(action: KeyAction, gradient: string): Promise<void> {
		const lambdaSvg = `<svg width="80px" height="80px" viewBox="0 0 80 80" version="1.2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<!-- Generator: Sketch 64 (93537) - https://sketch.com -->
			<title>Icon-Architecture/64/Arch_AWS-Lambda_64</title>
			<desc>Created with Sketch.</desc>
			<defs>
				<linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="linearGradient-ready">
					<stop stop-color="#C8511B" offset="0%"></stop>
					<stop stop-color="#FF9900" offset="100%"></stop>
				</linearGradient>
				<linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="linearGradient-running">
					<stop stop-color="#0b5394" offset="0%"></stop>
					<stop stop-color="#3d85c6" offset="100%"></stop>
				</linearGradient>
				<linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="linearGradient-success">
					<stop stop-color="#38761d" offset="0%"></stop>
					<stop stop-color="#6aa84f" offset="100%"></stop>
				</linearGradient>
				<linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="linearGradient-failure">
					<stop stop-color="#990000" offset="0%"></stop>
					<stop stop-color="#cc0000" offset="100%"></stop>
				</linearGradient>
			</defs>
			<g id="Icon-Architecture/64/Arch_AWS-Lambda_64" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="Icon-Architecture-BG/64/Compute" fill="url(#linearGradient-${gradient})">
					<rect id="Rectangle" x="0" y="0" width="80" height="80"></rect>
				</g>
				
				<path d="M 31.368 43.136 L 22.481 43.136 L 32.305 24.006 L 36.762 32.545 L 31.368 43.136 Z M 32.949 22.173 C 32.827 21.946 32.577 21.8 32.305 21.8 L 32.298 21.8 C 32.026 21.8 31.775 21.946 31.654 22.18 L 20.7 43.516 C 20.592 43.723 20.607 43.963 20.743 44.156 C 20.871 44.349 21.1 44.469 21.344 44.469 L 31.818 44.469 C 32.097 44.469 32.348 44.323 32.469 44.09 L 38.2 32.825 C 38.293 32.638 38.293 32.431 38.2 32.245 L 32.949 22.173 Z M 57.833 43.136 L 49.004 43.136 L 34.845 15.521 C 34.723 15.287 34.473 15.141 34.194 15.141 L 28.42 15.141 L 28.427 8.475 L 39.746 8.475 L 53.841 36.091 C 53.962 36.324 54.213 36.471 54.492 36.471 L 57.833 36.471 L 57.833 43.136 Z M 58.549 35.138 L 54.943 35.138 L 40.848 7.522 C 40.726 7.289 40.476 7.142 40.197 7.142 L 27.711 7.142 C 27.318 7.142 26.996 7.442 26.996 7.809 L 26.982 15.807 C 26.982 15.987 27.06 16.154 27.196 16.281 C 27.332 16.401 27.511 16.474 27.704 16.474 L 33.743 16.474 L 47.902 44.09 C 48.024 44.323 48.274 44.469 48.553 44.469 L 58.549 44.469 C 58.942 44.469 59.264 44.169 59.264 43.803 L 59.264 35.804 C 59.264 35.438 58.942 35.138 58.549 35.138 Z" fill="#FFFFFF" id="AWS-Lambda_Icon_64_Squid" style=""></path>

			</g>
		</svg>`;

		await action.setImage(`data:image/svg+xml,${encodeURIComponent(lambdaSvg)}`);
	}
}

/**
 * Settings for {@link LambdaExecuterAction}.
 */
type LambdaExecuterSettings = {
	awsRegion?: string;
	awsProfile?: string;
	functionName?: string;
	functionShortName?: string;
	functionData?: string;
	successMessage?: string;
	failureMessage?: string;
	runningMessage?: string;
};

