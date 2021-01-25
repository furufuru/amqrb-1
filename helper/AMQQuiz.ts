import { EventEmitter } from 'events';
import { QuizOver, SendFeedback, PlayerLeft, RejoiningPlayer,
    SpectatorLeft, QuizNextVideoInfo, PlayNextSong, PlayerAnswers,
    AnswerResults, QuizEndResult, QuizWaitingBuffering, QuizXpCreditGain,
    QuizNoPlayers, PlayerAnswered, QuizOverlayMessage, QuizSkipMessage,
    ReturnLobbyVoteStart, GuessPhaseOver, QuizFatalError, PlayerNameChange,
    QuizPauseTriggered, QuizUnpauseTriggered, ReturnLobbyVoteResult, TeamMemberAnswer, AMQEventType,
    GameStarting,
} from './AMQEvents';
import { addCommandHandler, getGameSocket, coreEmitter, emitEvent } from './AMQSocket';
import { Logger } from './Logger';
import { NextVideoInfo } from '../interface/AMQQuiz.interface';
import { fetchSong } from './AMQSongFetcher';
import { CookieJar } from './AMQCore';

export function quizGame () {
    const { quiz } = AMQEventType;
    const io = getGameSocket();
    const quizEvents = [
        QuizOver, SendFeedback, PlayerLeft, RejoiningPlayer,
        SpectatorLeft, QuizNextVideoInfo, PlayNextSong, PlayerAnswers,
        AnswerResults, QuizEndResult, QuizWaitingBuffering, QuizXpCreditGain,
        QuizNoPlayers, PlayerAnswered, QuizOverlayMessage, QuizSkipMessage,
        ReturnLobbyVoteStart, GuessPhaseOver, QuizFatalError, PlayerNameChange,
        QuizPauseTriggered, QuizUnpauseTriggered, ReturnLobbyVoteResult, TeamMemberAnswer
    ];

    quizEvents.forEach(s => {
        addCommandHandler(s);
    });

    // quiz injections
    coreEmitter.on(GameStarting, () => {
        // load songs
        coreEmitter.on(QuizNextVideoInfo, async (d: NextVideoInfo) => {
            if (!CookieJar) throw new Error('No cookie.');
            const songId = d.videoInfo.id;

            const song = await fetchSong(songId, CookieJar);
        });
    });

}
