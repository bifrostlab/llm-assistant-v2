import { faker } from '@faker-js/faker';
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import type { OpenAI } from 'openai';
import type { ChatCompletion } from 'openai/resources/chat/completions';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { captor, mockDeep, mockReset } from 'vitest-mock-extended';
import { getClient } from '../llm/client';
import { autocomplete, execute } from './index';

const mockAutocompleteInteraction = mockDeep<AutocompleteInteraction>();
const mockChatInputInteraction = mockDeep<ChatInputCommandInteraction>();

const mockChatCompletions = vi.fn();
vi.mock('../llm/client');
const mockGetClient = vi.mocked(getClient);
mockGetClient.mockReturnValue({
  chat: {
    completions: {
      create: mockChatCompletions,
    },
  },
} as unknown as OpenAI);

describe('ask.command', () => {
  describe('autocomplete', () => {
    beforeEach(() => {
      mockReset(mockAutocompleteInteraction);
    });

    it("Should return nothing if the short term isn't long enough", async () => {
      mockAutocompleteInteraction.options.getString.mockReturnValueOnce('solve');
      const respondInput = captor<Parameters<AutocompleteInteraction['respond']>['0']>();

      await autocomplete(mockAutocompleteInteraction);

      expect(mockAutocompleteInteraction.respond).toBeCalledWith(respondInput);
      expect(respondInput.value.length).toEqual(0);
    });

    it('Should return nothing if no options are found', async () => {
      mockAutocompleteInteraction.options.getString.mockReturnValueOnce('some random search that not existed');
      const respondInput = captor<Parameters<AutocompleteInteraction['respond']>['0']>();

      await autocomplete(mockAutocompleteInteraction);

      expect(mockAutocompleteInteraction.respond).toBeCalledWith(respondInput);
      expect(respondInput.value.length).toEqual(0);
    });

    it('Should return some options if search term is long enough and a result can be found', async () => {
      mockAutocompleteInteraction.options.getString.mockReturnValueOnce('phi');
      const respondInput = captor<Parameters<AutocompleteInteraction['respond']>['0']>();

      await autocomplete(mockAutocompleteInteraction);

      expect(mockAutocompleteInteraction.respond).toBeCalledWith(respondInput);
      expect(respondInput.value).toMatchInlineSnapshot(`
      [
        {
          "name": "phi",
          "value": "phi",
        },
        {
          "name": "tinydolphin",
          "value": "tinydolphin",
        },
      ]
    `);
    });
  });

  describe('execute', () => {
    beforeEach(() => {
      mockReset(mockChatInputInteraction);
    });

    it('Should respond with error if model is invalid', async () => {
      mockChatInputInteraction.options.getString.mockImplementation((param) => {
        switch (param) {
          case 'model':
            return 'invalidmodel';

          default:
            return 'asdf1234';
        }
      });
      const respondInput = captor<Parameters<ChatInputCommandInteraction['reply']>['0']>();

      await execute(mockChatInputInteraction);

      expect(mockChatInputInteraction.reply).toBeCalledWith(respondInput);
      expect(respondInput.value).toContain('Invalid model');
    });

    it('Should respond with error if there is an error asking the LLM', async () => {
      mockChatInputInteraction.options.getString.mockImplementation((param) => {
        switch (param) {
          case 'model':
            return 'tinydolphin';

          default:
            return 'asdf1234';
        }
      });
      mockChatCompletions.mockRejectedValueOnce(new Error('Synthetic Error.'));
      const respondInput = captor<Parameters<ChatInputCommandInteraction['reply']>['0']>();

      await execute(mockChatInputInteraction);

      expect(mockChatInputInteraction.reply).toBeCalledWith(respondInput);
      expect(respondInput.value).toContain('Error in asking the LLM');
    });

    it('Should respond with no response if there is no response', async () => {
      mockChatInputInteraction.options.getString.mockImplementation((param) => {
        switch (param) {
          case 'model':
            return 'tinydolphin';

          default:
            return 'asdf1234';
        }
      });
      mockChatCompletions.mockResolvedValueOnce({
        id: faker.string.uuid(),
        created: faker.number.int(),
        model: 'tinydolphin',
        object: 'chat.completion',
        choices: [
          {
            finish_reason: 'stop',
            index: 0,
            logprobs: null,
            message: {
              content: null,
            },
          },
        ] as ChatCompletion.Choice[],
      });
      const respondInput = captor<Parameters<ChatInputCommandInteraction['reply']>['0']>();

      await execute(mockChatInputInteraction);

      expect(mockChatInputInteraction.reply).toBeCalledWith(respondInput);
      expect(respondInput.value).toContain('No response');
    });

    it('Should respond with the LLM response', async () => {
      mockChatInputInteraction.options.getString.mockImplementation((param) => {
        switch (param) {
          case 'model':
            return 'tinydolphin';

          default:
            return 'asdf1234';
        }
      });
      const mockAnswer = faker.lorem.sentence();
      mockChatCompletions.mockResolvedValueOnce({
        id: faker.string.uuid(),
        created: faker.number.int(),
        model: 'tinydolphin',
        object: 'chat.completion',
        choices: [
          {
            finish_reason: 'stop',
            index: 0,
            logprobs: null,
            message: {
              content: mockAnswer,
            },
          },
        ] as ChatCompletion.Choice[],
      });
      const respondInput = captor<Parameters<ChatInputCommandInteraction['reply']>['0']>();

      await execute(mockChatInputInteraction);

      expect(mockChatInputInteraction.reply).toBeCalledWith(respondInput);
      expect(respondInput.value).toContain(`Q: asdf1234\nA: ${mockAnswer}`);
    });
  });
});
