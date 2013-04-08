<xsl:transform xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output indent="yes" method="html"/>

  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>


  <xsl:template match="head">
    <xsl:copy>
      <xsl:apply-templates select="head"/>
      <script id="scxml" type="application/scxml">
        <xsl:apply-templates select="/html/body" mode="scxml"/>
      </script>
    </xsl:copy>
  </xsl:template>


  <xsl:template match="body" mode="scxml">
<xsl:text><![CDATA[<s>]]></xsl:text>
  </xsl:template>

  <xsl:template match="h1"><h1>Transformed</h1></xsl:template>

<!--


    <scxml 
        version="1.0"
        profile="ecmascript">


      <script>
        function summarise() {
          $summary = $("#summary").html('<h2>Summary</h2>');
          $summary.append(
           (claimantNameAddress? "&lt;div&gt;claimant:" + claimantNameAddress + "&lt;/div&gt;" : "") +
           (pillColour? "&lt;div&gt;pillColour:" + pillColour + "&lt;/div&gt;" : "")
           );
        }
      </script>
      
      <xsl:apply-templates/>
    </scxml>
  </xsl:template>

  <xsl:template match="datamodel">
    <datamodel>
      <xsl:apply-templates select="data"/>
    </datamodel>
  </xsl:template>

  <xsl:template match="data">
    <data id="{@id}"/>
  </xsl:template>

  <xsl:template match="state">
    <state id="{@id}">
      <onentry><script>summarise();$("#<xsl:value-of select="@id"/>").css("display", "block");</script></onentry>
      <onexit><script>$("#<xsl:value-of select="@id"/>").css("display", "none");</script></onexit>
      <xsl:apply-templates/>
    </state>
  </xsl:template>

  <xsl:template match="onentry"><onentry><xsl:apply-templates/></onentry></xsl:template>
  <xsl:template match="onexit"><onexit><xsl:apply-templates/></onexit></xsl:template>

  <xsl:template match="transition">
    <transition event="submit" target="{@target}">
      <xsl:if test="@if">
        <xsl:variable name="binding">
          <xsl:call-template name="makeBinding">
            <xsl:with-param name="id" select="@if"/>
          </xsl:call-template>
        </xsl:variable>
        <xsl:attribute name="cond">
          <xsl:choose>
            <xsl:when test="@is"><xsl:value-of select="concat('(', $binding, ') === (',@is,')')"/></xsl:when>
          </xsl:choose>
        </xsl:attribute>
      </xsl:if>
    </transition>              
  </xsl:template>

  <xsl:template name="makeBinding">
    <xsl:param name="id" select="'undefined'"/>
    <xsl:variable name="type" select="/flow/datamodel/data[@id = $id]/@type"/>
    <xsl:choose>
      <xsl:when test="$type = 'textArea'">$('#<xsl:value-of select="$id"/> textarea').val()</xsl:when>
      <xsl:when test="$type = 'oneOf'">$('#<xsl:value-of select="$id"/> input:radio[name=\'<xsl:value-of select="$id"/>\']:checked').val()</xsl:when>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="bind">
    <onexit>
      <assign location="{@name}">
        <xsl:attribute name="expr">
          <xsl:call-template name="makeBinding">
            <xsl:with-param name="id" select="ancestor::state/@id"/>
          </xsl:call-template>
        </xsl:attribute>
      </assign>
    </onexit>
  </xsl:template>
-->

</xsl:transform>
