package mail

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRenderTemplateWithCSVData(t *testing.T) {
	raw := "Hello {{.first_name}}, welcome to {{.city}}!"
	data := map[string]interface{}{
		"first_name": "Alice",
		"city": "New York",
	}

	rendered, err := RenderTemplate(raw, data)
	assert.NoError(t, err)
	assert.Equal(t, "Hello Alice, welcome to New York!", rendered)
}
