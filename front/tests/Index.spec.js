import {render, screen} from '@testing-library/vue'
import Index from '@/pages/index.vue'
import ModalDialog from '@/components/ModalDialog.vue'

test('renders home page', () => {
  render(Index, {components: {ModalDialog}})
  expect(screen.queryByTestId('index-header')).toHaveTextContent('Welcome to Country Comparison trivia')
})